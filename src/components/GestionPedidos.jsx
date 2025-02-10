import { useState, useEffect } from "react";
import clienteAxios from "@/config/axios";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle } from "lucide-react";

const GestionPedidos = () => {
  const { auth } = useAuth();
  const [state, setState] = useState({
    pedidos: [],
    loading: true,
    error: null,
    filtroEstado: "todos",
    ordenamiento: "recientes",
  });

  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filtroEstado, state.ordenamiento]);

  const fetchPedidos = async () => {
    try {
      const { data } = await clienteAxios.get("/pedidos/mis-pedidos", {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: {
          estado: state.filtroEstado !== "todos" ? state.filtroEstado : undefined,
          sort: state.ordenamiento === "recientes" ? "-fecha" : "fecha",
        },
      });

      console.log("Pedidos recibidos:", data);
      setState((prev) => ({
        ...prev,
        pedidos: data,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Error al cargar pedidos",
      }));
    }
  };

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    try {
      await clienteAxios.put(
        `/pedidos/${pedidoId}/estado`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setState((prev) => ({
        ...prev,
        pedidos: prev.pedidos.map((pedido) =>
          pedido._id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        ),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || "Error al actualizar estado",
      }));
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "bg-yellow-100 text-yellow-800",
      pagado: "bg-blue-100 text-blue-800",
      enviado: "bg-green-100 text-green-800",
      entregado: "bg-gray-100 text-gray-800",
    };
    return colores[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 p-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Select
          value={state.filtroEstado}
          onValueChange={(value) =>
            setState((prev) => ({ ...prev, filtroEstado: value, loading: true }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="pagado">Pagado</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="entregado">Entregado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={state.ordenamiento}
          onValueChange={(value) =>
            setState((prev) => ({ ...prev, ordenamiento: value, loading: true }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recientes">Más recientes</SelectItem>
            <SelectItem value="antiguos">Más antiguos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Listado de pedidos */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Gestión de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : state.pedidos.length > 0 ? (
                state.pedidos.map((pedido) => (
                  <TableRow key={pedido._id}>
                    <TableCell>
                      {format(new Date(pedido.fecha), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>{pedido.usuario?.nombre || "Anónimo"}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {pedido.productos
                          .map((p) => p.producto?.nombre)
                          .join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>${pedido.montoTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(pedido.estado)}>
                        {pedido.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {auth?.role === "admin" ? (
                        <Select
                          value={pedido.estado}
                          onValueChange={(value) =>
                            handleEstadoChange(pedido._id, value)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="pagado">Pagado</SelectItem>
                            <SelectItem value="enviado">Enviado</SelectItem>
                            <SelectItem value="entregado">Entregado</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getEstadoColor(pedido.estado)}>
                          {pedido.estado}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron pedidos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionPedidos;
