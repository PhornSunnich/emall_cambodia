import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const add = (product) => setCart((c) => [...c, product]);
  const remove = (id) => setCart((c) => c.filter((p) => p.id !== id));
  const clear = () => setCart([]);

  return { cart, add, remove, clear, count: cart.length };
};

export const useFavorites = () => {
  const [fav, setFav] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(fav));
  }, [fav]);

  const toggle = (product) => {
    setFav((f) => {
      const exists = f.some((p) => p.id === product.id);
      return exists ? f.filter((p) => p.id !== product.id) : [...f, product];
    });
  };

  return { favorites: fav, toggle, count: fav.length };
};