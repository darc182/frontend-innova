// src/paginas/CategoriaPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../config/axios';


const CategoriaPage = () => {
  const { slug } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clienteAxios(`productos/categoria/${slug}`)
      .then((response) => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p className="text-center mt-8">Cargando productos...</p>;

  return (
    <>
    
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Categoría: {slug}</h1>
      {productos.length === 0 ? (
        <p className="text-center">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={producto.imagen[0]} // Se asume que 'imagen' es un arreglo
                alt={producto.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
                <p className="text-indigo-700 font-bold mb-2">{producto.precio} €</p>
                <a href="#" className="text-indigo-600 hover:underline font-medium">
                  Ver Detalles
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    
    </>
  );
};

export default CategoriaPage;
