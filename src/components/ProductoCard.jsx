import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './ui/card';

const ProductoCard = ({ producto }) => {
  const { addToCart } = useCart();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <img 
          src={producto.imagen[0]} 
          alt={producto.nombre} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl">{producto.nombre}</CardTitle>
        <CardDescription className="mt-2 line-clamp-3">
          {producto.descripcion}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-2xl font-bold">${producto.precio}</span>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/producto/${producto._id}`}>Detalles</Link>
          </Button>
          <Button onClick={() => addToCart(producto._id)}>
            Agregar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductoCard;