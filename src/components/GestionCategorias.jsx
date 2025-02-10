import { useState, useEffect } from "react";
import clienteAxios from "@/config/axios";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import slugify from "slugify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const GestionCategorias = () => {
  const { auth } = useAuth();
  const [state, setState] = useState({
    categorias: [],
    formData: {
      nombre: "",
      slug: "",
    },
    editingId: null,
    errors: {},
    loading: false,
    deletingId: null,
    searchTerm: "",
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const { data } = await clienteAxios.get("/categorias");
      setState(prev => ({ ...prev, categorias: data }));
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const slug = name === "nombre" ? slugify(value, { lower: true, strict: true }) : value;
    
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
        slug: name === "nombre" ? slug : prev.formData.slug
      },
      errors: { ...prev.errors, [name]: "" }
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!state.formData.nombre) errors.nombre = "Nombre es requerido";
    if (!state.formData.slug) errors.slug = "Slug es requerido";
    
    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { nombre, slug } = state.formData;
      const categoriaData = { nombre, slug };

      console.log(auth.token);
      console.log(auth);
      
      


      if (state.editingId) {
        await clienteAxios.put(`/categorias/${state.editingId}`, categoriaData, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
      } else {
        await clienteAxios.post("/categorias", categoriaData, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
      }

      await fetchCategorias();
      resetForm();
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { general: error.response?.data?.message || "Error al guardar la categoría" },
        loading: false
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleEdit = (categoria) => {
    setState(prev => ({
      ...prev,
      formData: {
        nombre: categoria.nombre,
        slug: categoria.slug
      },
      editingId: categoria._id,
      errors: {}
    }));
  };

  const handleDelete = async () => {
    try {
      await clienteAxios.delete(`/categorias/${state.deletingId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      fetchCategorias();
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    } finally {
      setState(prev => ({ ...prev, deletingId: null }));
    }
  };

  const resetForm = () => {
    setState(prev => ({
      ...prev,
      formData: { nombre: "", slug: "" },
      editingId: null,
      errors: {}
    }));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Formulario */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {state.editingId ? "Editar Categoría" : "Nueva Categoría"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label>Slug</Label>
              <Input
                name="slug"
                value={state.formData.slug}
                onChange={handleInputChange}
              />
              {state.errors.slug && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {state.errors.slug}
                </p>
              )}
            </div>

            {state.errors.general && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {state.errors.general}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={state.loading}>
                {state.loading ? "Guardando..." : "Guardar Categoría"}
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

      {/* Listado */}
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar categorías..."
            value={state.searchTerm}
            onChange={(e) => setState(prev => ({...prev, searchTerm: e.target.value}))}
          />
        </div>

        <div className="space-y-4">
          {state.categorias.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[70px] w-full rounded-lg" />
            ))
          ) : (
            state.categorias
              .filter(cat => 
                cat.nombre.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                cat.slug.toLowerCase().includes(state.searchTerm.toLowerCase())
              )
              .map(categoria => (
                <Card key={categoria._id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{categoria.nombre}</h3>
                      <p className="text-sm text-gray-500">{categoria.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(categoria)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setState(prev => ({...prev, deletingId: categoria._id}))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={!!state.deletingId}
        onOpenChange={() => setState(prev => ({...prev, deletingId: null}))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará la categoría permanentemente. ¿Estás seguro?
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

export default GestionCategorias;