import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Package, List, User, LogOut } from "lucide-react";

import GestionProductos from "@/components/GestionProductos";
import GestionCategorias from "@/components/GestionCategorias";
import GestionPedidos from "@/components/GestionPedidos";
import EditarPerfil from "@/components/EditarPerfil";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({});
    navigate("/auth");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administración
        </h1>
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut size={18} /> Cerrar Sesión
        </Button>
      </div>

      {/* Tabs de navegación */}
      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex space-x-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
          <TabsTrigger value="products" className="flex items-center gap-2 px-4 py-2">
            <Package size={18} /> Productos
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2 px-4 py-2">
            <List size={18} /> Categorías
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2 px-4 py-2">
            <Edit size={18} /> Pedidos
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2">
            <User size={18} /> Perfil
          </TabsTrigger>
        </TabsList>

        {/* Sección de productos */}
        <TabsContent value="products">
          <Card className="mt-4 shadow-md">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Gestión de Productos
              </h2>
              <GestionProductos />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección de categorías */}
        <TabsContent value="categories">
          <Card className="mt-4 shadow-md">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Gestión de Categorías
              </h2>
            
              <GestionCategorias/>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección de pedidos */}
        <TabsContent value="orders">
          <Card className="mt-4 shadow-md">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Actualizar Estados de Pedidos
              </h2>

              <GestionPedidos/>
              
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección de perfil */}
        <TabsContent value="profile">
          <Card className="mt-4 shadow-md">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Editar Perfil
              </h2>
              <EditarPerfil/>
              
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

