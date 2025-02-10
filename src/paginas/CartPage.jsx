import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Tu Carrito</h1>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map(item => (
              <TableRow key={item.productoId}>
                <TableCell>{item.productoId.nombre}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>${item.productoId.precio * item.cantidad}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive"
                    onClick={() => removeFromCart(item.productoId._id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="text-right text-2xl font-bold">
        Total: ${cart.reduce((acc, item) => acc + (item.productoId.precio * item.cantidad), 0)}
      </div>
    </div>
  );
};

export default CartPage;