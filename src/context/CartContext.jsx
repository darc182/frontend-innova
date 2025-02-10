import { createContext, useContext, useEffect, useState } from 'react';
import clienteAxios from '../config/axios';
import useAuth from '@/hooks/useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const [cart, setCart] = useState([]);

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

  const removeFromCart = (productoId) => {
    setCart(prev => prev.filter(item => item.productoId !== productoId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, mergeCarts }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);