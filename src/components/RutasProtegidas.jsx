import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RutaProtegida = ({ allowedRoles }) => {
  const { auth, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  console.log("Verificando autenticación:", auth);
  console.log("Roles permitidos en esta ruta:", allowedRoles);

  if (!auth || !auth.role) {
    console.log("Redirigiendo a login, auth no tiene datos:", auth);
    return <Navigate to="/auth" replace />;
  }

  console.log("Rol del usuario:", auth.role);


  if (!Array.isArray(allowedRoles)) {
    console.error("allowedRoles no es un array válido:", allowedRoles);
    return <Navigate to="/" replace />;
  }

  
  if (!allowedRoles.includes(auth.role)) {
    console.log("Redirigiendo, rol no permitido:", auth.role);
    return <Navigate to={auth.role === 'admin' ? "/admin" : "/user"} replace />;
  }

  return <Outlet />;
};

export default RutaProtegida;
