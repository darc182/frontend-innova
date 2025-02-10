
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingCart, CreditCard, User, LogOut } from "lucide-react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({});
    navigate("/auth");
  };

  return (
    <div className="p-6 relative min-h-screen">
      {/* Encabezado con botón de cerrar sesión */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mi Cuenta</h1>
        <Button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
          <LogOut size={18} /> Cerrar Sesión
        </Button>
      </div>

      {/* Tabs de navegación */}
      <Tabs defaultValue="cart" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-2">
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingCart size={18} /> Carrito
          </TabsTrigger>
          <TabsTrigger value="order" className="flex items-center gap-2">
            <CreditCard size={18} /> Pedido
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={18} /> Perfil
          </TabsTrigger>
        </TabsList>

        {/* Carrito de Compras */}
        <TabsContent value="cart">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Carrito de Compras</h2>
              <p className="text-gray-500">Aquí verás los productos agregados al carrito.</p>
              <Button className="mt-2">Ver Carrito</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detalles del Pedido */}
        <TabsContent value="order">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
              <p className="text-gray-500">Resumen de la compra, método de pago y monto total.</p>
              <Button className="mt-2">Ver Detalle del Pedido</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Perfil del Usuario */}
        <TabsContent value="profile">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Editar Perfil</h2>
              <Button className="mt-2">Actualizar Perfil</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
