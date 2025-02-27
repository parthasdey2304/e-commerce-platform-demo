import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load cart from local storage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);

    // If user is logged in, fetch their cart from database
    if (user) {
      fetchUserCart();
    }
  }, [user]);

  const fetchUserCart = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        const cartItems = data.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image_url,
          quantity: item.quantity
        }));
        setCart(cartItems);
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Error fetching user cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let newCart;

    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    // If user is logged in, sync with database
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: product.id,
            quantity: existingItemIndex >= 0 ? newCart[existingItemIndex].quantity : quantity
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating cart in database:', error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    // If user is logged in, remove from database
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
      } catch (error) {
        console.error('Error removing item from cart in database:', error);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem('cart');

    // If user is logged in, clear their cart in database
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error clearing cart in database:', error);
      }
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  return useContext(CartContext);
};
