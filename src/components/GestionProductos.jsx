import { useState, useEffect, useCallback } from "react";
import clienteAxios from "@/config/axios";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const GestionProductos = () => {
  const { auth } = useAuth();
  const [state, setState] = useState({
    productos: [],
    categorias: [],
    formData: {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      stock: "",
      sku: "",
      imagen: [],
    },
    editingId: null,
    errors: {},
    loading: false,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    searchTerm: "",
    deletingId: null,
    imagePreviews: [],
    skuChecking: false,
    skuError: "",
  });

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const checkSkuUnique = useCallback(
    debounce(async (sku) => {
      if (!sku) return;
      try {
        setState(prev => ({...prev, skuChecking: true}));
        const { data } = await clienteAxios.get(`/productos?sku=${sku}`);
        const exists = data.productos.some(
          p => p.sku === sku && p._id !== state.editingId
        );
        setState(prev => ({
          ...prev,
          skuError: exists ? "SKU ya está en uso" : "",
          skuChecking: false
        }));
      } catch (error) {
        setState(prev => ({...prev, skuChecking: false}));
      }
    }, 500),
    [state.editingId]
  );

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [state.currentPage, state.itemsPerPage, state.searchTerm]);

  useEffect(() => {
    if (state.formData.sku && !state.editingId) {
      checkSkuUnique(state.formData.sku);
    }
  }, [state.formData.sku]);

  const fetchProductos = async () => {
    try {
      const { data } = await clienteAxios.get(
        `/productos?page=${state.currentPage}&limit=${state.itemsPerPage}&nombre=${state.searchTerm}`
      );
      setState(prev => ({
        ...prev,
        productos: data.productos,
        totalPages: Math.ceil(data.total / state.itemsPerPage),
      }));
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const { data } = await clienteAxios.get("/categorias");
      setState(prev => ({...prev, categorias: data}));
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: {...prev.formData, [name]: value},
      errors: {...prev.errors, [name]: ""}
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    
    setState(prev => ({
      ...prev,
      formData: {...prev.formData, imagen: files},
      imagePreviews: [...prev.imagePreviews, ...previews]
    }));
  };

  const removeImagePreview = (index) => {
    setState(prev => {
      const newPreviews = [...prev.imagePreviews];
      const newFiles = [...prev.formData.imagen];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      newFiles.splice(index, 1);
      return {
        ...prev,
        imagePreviews: newPreviews,
        formData: {...prev.formData, imagen: newFiles}
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!state.formData.nombre) errors.nombre = "Nombre es requerido";
    if (!state.formData.descripcion) errors.descripcion = "Descripción es requerida";
    if (!state.formData.precio || state.formData.precio <= 0) errors.precio = "Precio inválido";
    if (!state.formData.categoria) errors.categoria = "Selecciona una categoría";
    if (state.skuError) errors.sku = state.skuError;
    
    setState(prev => ({...prev, errors}));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setState(prev => ({...prev, loading: true}));

    try {
      const token = auth.token || localStorage.getItem('token');
      const formDataToSend = new FormData();
      Object.entries(state.formData).forEach(([key, value]) => {
        if (key === "imagen") {
          state.formData.imagen.forEach(file => formDataToSend.append("imagen", file));
        } else {
          formDataToSend.append(key, value);
        }
      });

      if (state.editingId) {
        await clienteAxios.put(`/productos/${state.editingId}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await clienteAxios.post("/productos", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
      }

      await fetchProductos();
      resetForm();
    } catch (error) {
      const serverErrors = error.response?.data?.errors || [];
      const errorMessages = {};
      serverErrors.forEach(err => {
        errorMessages[err.path] = err.msg;
      });
      setState(prev => ({
        ...prev,
        errors: errorMessages,
        loading: false
      }));
    } finally {
      setState(prev => ({...prev, loading: false}));
    }
  };

  const handleEdit = (producto) => {
    setState(prev => ({
      ...prev,
      formData: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria._id,
        stock: producto.stock,
        sku: producto.sku,
        imagen: []
      },
      editingId: producto._id,
      imagePreviews: producto.imagen,
      errors: {}
    }));
  };

  const handleDelete = async () => {
    try {
      const token = auth.token || localStorage.getItem('token');
      await clienteAxios.delete(`/productos/${state.deletingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProductos();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setState(prev => ({...prev, deletingId: null}));
    }
  };

  const resetForm = () => {
    setState(prev => ({
      ...prev,
      formData: {
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        stock: "",
        sku: "",
        imagen: []
      },
      editingId: null,
      imagePreviews: [],
      errors: {}
    }));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Formulario */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {state.editingId ? "Editar Producto" : "Nuevo Producto"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del formulario */}
            <div>
              <Label>Nombre</Label>
              <Input
                name="nombre"
                value={state.formData.nombre}
                onChange={handleInputChange}
              />
              {state.errors.nombre && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {state.errors.nombre}
                </p>
              )}
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                name="descripcion"
                value={state.formData.descripcion}
                onChange={handleInputChange}
              />
              {state.errors.descripcion && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {state.errors.descripcion}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Precio</Label>
                <Input
                  type="number"
                  name="precio"
                  value={state.formData.precio}
                  onChange={handleInputChange}
                />
                {state.errors.precio && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {state.errors.precio}
                  </p>
                )}
              </div>

              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  name="stock"
                  value={state.formData.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoría</Label>
                <select
                  name="categoria"
                  value={state.formData.categoria}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccionar categoría</option>
                  {state.categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                {state.errors.categoria && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {state.errors.categoria}
                  </p>
                )}
              </div>

              <div>
                <Label>SKU</Label>
                <Input
                  name="sku"
                  value={state.formData.sku}
                  onChange={handleInputChange}
                />
                {state.skuChecking && (
                  <p className="text-sm text-gray-500 mt-1">Verificando SKU...</p>
                )}
                {state.skuError && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {state.skuError}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Imágenes (Máx. 5)</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {state.imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="h-20 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImagePreview(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={state.loading}>
                {state.loading ? "Guardando..." : "Guardar Producto"}
              </Button>
              {state.editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancelar Edición
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Listado y controles */}
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar productos..."
            value={state.searchTerm}
            onChange={(e) => setState(prev => ({...prev, searchTerm: e.target.value}))}
          />
          <select
            value={state.itemsPerPage}
            onChange={(e) => setState(prev => ({...prev, itemsPerPage: Number(e.target.value)}))}
            className="p-2 border rounded"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
          </select>
        </div>

        <div className="space-y-4">
          {state.productos.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
            ))
          ) : (
            state.productos.map(producto => (
              <Card key={producto._id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    {producto.imagen[0] && (
                      <img
                        src={producto.imagen[0]}
                        alt={producto.nombre}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{producto.nombre}</h3>
                      <div className="text-sm text-gray-500">
                        <p>{producto.categoria?.nombre}</p>
                        <p>Stock: {producto.stock}</p>
                        <p>${producto.precio}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(producto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setState(prev => ({...prev, deletingId: producto._id}))}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={state.currentPage === 1}
            onClick={() => setState(prev => ({...prev, currentPage: prev.currentPage - 1}))}
          >
            Anterior
          </Button>
          <span>
            Página {state.currentPage} de {state.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={state.currentPage >= state.totalPages}
            onClick={() => setState(prev => ({...prev, currentPage: prev.currentPage + 1}))}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={!!state.deletingId}
        onOpenChange={() => setState(prev => ({...prev, deletingId: null}))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de eliminar este producto?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setState(prev => ({...prev, deletingId: null}))}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionProductos;