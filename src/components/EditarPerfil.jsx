import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, User, Lock } from "lucide-react";

const EditarPerfil = () => {
  const { auth, cargando,actualizarPerfil, cambiarPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  
  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    nuevoPassword: '',
    confirmarPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

   // Cargar datos cuando auth esté disponible
   useEffect(() => {
    if (auth && auth.nombre) {
        setFormData({
            nombre: auth.nombre,
            direccion: auth.direccion || '',
            telefono: auth.telefono || ''
        });
    }
}, [auth]); // Se ejecuta cuando auth cambie

  console.log(auth);
  
  // Si no hay usuario autenticado
  if (!auth || !auth._id) {
    return <p>No has iniciado sesión</p>;
}

  const handlePerfilSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const resultado = await actualizarPerfil(formData);
      
      setMensaje({
        tipo: resultado.error ? 'error' : 'exito',
        texto: resultado.msg
      });

      if (!resultado.error) {
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      }
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error inesperado al actualizar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    if (passwordData.nuevoPassword !== passwordData.confirmarPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    try {
      const resultado = await cambiarPassword({
        passwordActual: passwordData.passwordActual,
        nuevoPassword: passwordData.nuevoPassword
      });
      
      if (!resultado.error) {
        setPasswordData({
          passwordActual: '',
          nuevoPassword: '',
          confirmarPassword: ''
        });
      }
      
      setMensaje({
        tipo: resultado.error ? 'error' : 'exito',
        texto: resultado.msg
      });

    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error inesperado al cambiar la contraseña'
      });
    } finally {
      setLoading(false);
    }
  };

  const Mensaje = () => (
    <div className={`p-3 rounded-md flex items-center gap-2 ${
      mensaje.tipo === 'error' 
        ? 'bg-red-50 text-red-700' 
        : 'bg-green-50 text-green-700'
    }`}>
      {mensaje.tipo === 'error' ? (
        <AlertCircle className="h-5 w-5" />
      ) : (
        <CheckCircle className="h-5 w-5" />
      )}
      <span>{mensaje.texto}</span>
    </div>
  );

  // Mostrar loading mientras se carga
  if (cargando) {
    return (
        <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User size={18} /> Perfil
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock size={18} /> Contraseña
          </TabsTrigger>
        </TabsList>

        {/* Sección Perfil */}
        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Editar Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePerfilSubmit} className="space-y-4">
                {mensaje.texto && <Mensaje />}

                <div>
                  <Label>Nombre</Label>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label>Dirección</Label>
                  <Input
                    name="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Teléfono</Label>
                  <Input
                    name="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección Contraseña */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cambiar Contraseña</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {mensaje.texto && <Mensaje />}

                <div>
                  <Label>Contraseña Actual</Label>
                  <Input
                    type="password"
                    value={passwordData.passwordActual}
                    onChange={(e) => setPasswordData({...passwordData, passwordActual: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label>Nueva Contraseña</Label>
                  <Input
                    type="password"
                    value={passwordData.nuevoPassword}
                    onChange={(e) => setPasswordData({...passwordData, nuevoPassword: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label>Confirmar Nueva Contraseña</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmarPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmarPassword: e.target.value})}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditarPerfil;