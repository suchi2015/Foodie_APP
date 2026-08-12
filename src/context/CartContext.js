import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('foodapp_cart');
    const savedRestaurant = localStorage.getItem('foodapp_cart_restaurant');
    const savedRestaurantName = localStorage.getItem('foodapp_cart_restaurant_name');
    if (saved) setCartItems(JSON.parse(saved));
    if (savedRestaurant) setRestaurantId(savedRestaurant);
    if (savedRestaurantName) setRestaurantName(savedRestaurantName);
  }, []);

  const saveCart = (items, rId, rName) => {
    localStorage.setItem('foodapp_cart', JSON.stringify(items));
    if (rId) localStorage.setItem('foodapp_cart_restaurant', rId);
    if (rName) localStorage.setItem('foodapp_cart_restaurant_name', rName);
  };

  const addToCart = (item, rId, rName) => {
    // If adding from a different restaurant, confirm clear
    if (restaurantId && restaurantId !== rId && cartItems.length > 0) {
      if (!window.confirm('Your cart has items from another restaurant. Start a new cart?')) {
        return;
      }
      clearCart();
    }

    setRestaurantId(rId);
    setRestaurantName(rName);

    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      saveCart(updated, rId, rName);
      return updated;
    });

    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i._id !== itemId);
      saveCart(updated, restaurantId, restaurantName);
      return updated;
    });
  };

  const updateQuantity = (itemId, qty) => {
    if (qty < 1) return removeFromCart(itemId);
    setCartItems((prev) => {
      const updated = prev.map((i) => (i._id === itemId ? { ...i, quantity: qty } : i));
      saveCart(updated, restaurantId, restaurantName);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setRestaurantName('');
    localStorage.removeItem('foodapp_cart');
    localStorage.removeItem('foodapp_cart_restaurant');
    localStorage.removeItem('foodapp_cart_restaurant_name');
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        restaurantName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
