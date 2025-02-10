import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const CartPage = () => {
  const { cart, productosDetallados, removeFromCart } = useCart();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Tu Carrito</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Precio Unitario</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {cart.map((item, index) => {
            const producto = productosDetallados[index];
            return (
              <TableRow key={item.productoId._id}>
                <TableCell>{producto?.nombre || 'Cargando...'}</TableCell>
                <TableCell>${producto?.precio || 0}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>${(producto?.precio || 0) * item.cantidad}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive"
                    onClick={() => removeFromCart(item.productoId._id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      <div className="text-right text-2xl font-bold">
        Total: ${cart.reduce((acc, item, index) => {
          return acc + ((productosDetallados[index]?.precio || 0) * item.cantidad);
        }, 0)}
      </div>
    </div>
  );
};

export default CartPage