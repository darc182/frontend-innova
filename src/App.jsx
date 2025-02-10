import {BrowserRouter,Routes,Route} from 'react-router-dom'
import AuthLayout from './layout/AuthLayout'
import MainLayout from './layout/MainLayout';
import Login from './paginas/Login'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'
import ConfirmarCuenta from './paginas/ConfirmarCuenta'
import NuevoPassword from './paginas/NuevoPassword'
import RutaProtegida from './components/RutasProtegidas';
import  UserDashboard from './paginas/user/UserDashboard'
import AdminDashboard from './paginas/admin/AdminDashboard';

import CategoriaPage from './paginas/user/Categoria';
import HomePage from './paginas/HomePage';
import CartPage from './paginas/CartPage';



import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartContext';



function App() {
  

  return (
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
      
      <Routes>
        <Route path='/auth' element={<AuthLayout/>}>
            <Route index element={<Login/>}/>
            <Route path='registrar' element={<Registrar/>}/>
            <Route path='olvide-password'  element={<OlvidePassword/>}/>
            <Route path='olvide-password/:token' element={<NuevoPassword/>}/>
            <Route path='confirmar/:id' element={<ConfirmarCuenta/>}/>
        </Route>


        <Route path="/" element={<MainLayout />}>
         <Route index element={<HomePage />} />
          <Route path="categoria/:slug" element={<CategoriaPage />} />
          <Route path="carrito" element={<CartPage />} />
          
        
        </Route>


         {/* Rutas protegidas para Administradores */}
         <Route element={<RutaProtegida allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Otras rutas de administración */}
          </Route>

          {/* Rutas protegidas para Usuarios (no administradores) */}
          <Route element={<RutaProtegida allowedRoles={['user']} />}>
            <Route path="/user" element={<UserDashboard />} />
            {/* Otras rutas para usuarios */}
          </Route>
      </Routes>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
