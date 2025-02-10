import { useState, useEffect } from "react";
import clienteAxios from "@/config/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Se asume que el endpoint GET /productos devuelve un objeto con la propiedad "productos"
        const { data } = await clienteAxios.get("/productos");
        setProductos(data.productos);
      } catch (error) {
        console.error(
          "Error al obtener productos:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleAddToCart = (producto) => {
    // Usamos localStorage para almacenar el carrito si el usuario no está logueado
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Aquí puedes mejorar la lógica para incrementar la cantidad si el producto ya existe en el carrito
    cart.push({ ...producto, cantidad: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto agregado al carrito");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Productos Disponibles</h1>
      {loading ? (
        <p className="text-center">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <Card key={producto._id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {producto.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={
                    producto.imagen && producto.imagen.length > 0
                      ? producto.imagen[0]
                      : "https://via.placeholder.com/150"
                  }
                  alt={producto.nombre}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <p className="text-gray-500 mb-2">{producto.descripcion}</p>
                <p className="text-gray-600 mb-2">${producto.precio.toFixed(2)}</p>
                <Button onClick={() => handleAddToCart(producto)}>
                  Agregar al carrito
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carrito;
