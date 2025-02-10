import { useEffect, useState } from 'react';
import clienteAxios from '../config/axios';
import ProductoCard from '../components/ProductoCard';
import { Skeleton } from '../components/ui/skeleton';

const HomePage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const { data } = await clienteAxios('/productos');
        setProductos(data.productos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        Array(6).fill().map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))
      ) : (
        productos.map(producto => (
          <ProductoCard key={producto._id} producto={producto} />
        ))
      )}
    </div>
  );
};

export default HomePage;