// src/components/Categorias.jsx
import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    clienteAxios
      .get('categorias')
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);

  return (
    <div className="bg-gray-100 py-4">
      <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
        {categorias.length > 0 ? (
          categorias.map((categoria) => (
            <Link
              key={categoria._id}
              to={`/categoria/${categoria.slug}`}
              className="px-4 py-2 bg-white shadow rounded hover:bg-indigo-100 transition whitespace-nowrap"
            >
              {categoria.nombre}
            </Link>
          ))
        ) : (
          <p className="text-gray-600">No hay categorías disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Categorias;
