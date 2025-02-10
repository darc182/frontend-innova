import { createContext, useContext, useEffect, useState } from 'react';
import clienteAxios from '../config/axios';
import useAuth from '@/hooks/useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const [cart, setCart] = useState([]);
  const [productosDetallados, setProductosDetallados] = useState([]);

  // Cargar carrito local al iniciar
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    setCart(localCart);
  }, []);

  // Persistir carrito local
  useEffect(() => {
    if (!auth?._id) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, auth]);

  // Fusionar carritos al autenticar
  const mergeCarts = async () => {
    const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    if (localCart.length > 0) {
      try {
        await Promise.all(
          localCart.map(item => 
            clienteAxios.post('/carrito', {
              productoId: item.productoId,
              cantidad: item.cantidad
            })
          )
        );
        localStorage.removeItem('guestCart');
        setCart([]);
      } catch (error) {
        console.error('Error merging cart:', error);
      }
    }
  };

  const addToCart = async (productoId, cantidad = 1) => {
    if (auth?._id) {
      await clienteAxios.post('/carrito', { productoId, cantidad });
    } else {
      setCart(prev => {
        const existing = prev.find(item => item.productoId === productoId);
        return existing ? 
          prev.map(item => item.productoId === productoId ? 
            { ...item, cantidad: item.cantidad + cantidad } : item) :
          [...prev, { productoId, cantidad }];
      });
    }
  };

 

 // Cargar y sincronizar carrito
 useEffect(() => {
    const syncCart = async () => {
      if (auth?._id) {
        // Usuario autenticado: cargar desde backend
        const { data } = await clienteAxios.get('/carrito');
        setCart(data?.items || []);
      } else {
        // Usuario invitado: cargar desde localStorage
        const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        const productos = await Promise.all(
          localCart.map(async item => {
            const { data } = await clienteAxios.get(`/productos/${item.productoId}`);
            return { ...item, productoId: data };
          })
        );
        setCart(productos);
      }
    };
    syncCart();
  }, [auth]);

  // Actualizar productos detallados
  useEffect(() => {
    const obtenerDetalles = async () => {
      const detalles = await Promise.all(
        cart.map(async item => {
          const { data } = await clienteAxios.get(`/productos/${item.productoId}`);
          return data;
        })
      );
      setProductosDetallados(detalles);
    };
    if (cart.length > 0) obtenerDetalles();
  }, [cart]);

  // Eliminar item
  const removeFromCart = async (productoId) => {
    if (auth?._id) {
      await clienteAxios.delete(`/carrito/item/${productoId}`);
      setCart(prev => prev.filter(item => item.productoId._id !== productoId));
    } else {
      const newCart = cart.filter(item => item.productoId._id !== productoId);
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
    }
  };


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, mergeCarts, productosDetallados,removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);