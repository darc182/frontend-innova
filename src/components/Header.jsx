import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useAuth from '@/hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

const Header = () => {
  const { auth, cargando, cerrarSesion } = useAuth();
  const { cart } = useCart();

  if (cargando) {
    return <div>Cargando...</div>; // Muestra un loader mientras se carga la autenticación
  }

  return (
    <header className="bg-indigo-700 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          InnovaTextil
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/carrito" className="relative">
            <Button variant="ghost" size="icon">
              🛒
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1">
                  {cart.reduce((acc, item) => acc + item.cantidad, 0)}
                </Badge>
              )}
            </Button>
          </Link>

          {auth?._id ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>
                    {auth.nombre[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/perfil">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={cerrarSesion}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/auth">Ingresar</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/registrar">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;