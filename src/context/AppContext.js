// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null); // ← logged-in user

  // Load from localStorage on first load
  useEffect(() => {
    const savedCart = localStorage.getItem("emall_cart");
    const savedFavorites = localStorage.getItem("emall_favorites");
    const savedUser = localStorage.getItem("emall_user");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Save cart & favorites every time they change
  useEffect(() => {
    localStorage.setItem("emall_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("emall_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save user when login/logout
  useEffect(() => {
    if (user) {
      localStorage.setItem("emall_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("emall_user");
    }
  }, [user]);

  // ==================== CART ====================
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]); // Only used on checkout, NOT on logout

  // ==================== FAVORITES ====================
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      return exists
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, product];
    });
  };

  const isFavorite = (id) => favorites.some((i) => i.id === id);

  // ==================== AUTH ====================
  const login = (userData) => setUser(userData);

  // LOGOUT NOW PRESERVES CART & FAVORITES!
  const logout = () => {
    setUser(null);
    // Do NOT clear cart or favorites here → they stay in localStorage
    // Only user is removed
  };

  // ==================== CALCULATIONS ====================
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = cart
    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    .toFixed(2);

  const value = {
    // Cart
    cart,
    cartCount,
    cartTotal: Number(cartTotal),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,

    // User
    user,
    setUser,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
export default AppProvider;