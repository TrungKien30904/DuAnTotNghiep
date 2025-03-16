// src/User/pages/cart/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo context
export const CartContext = createContext();

// Provider bao bọc toàn bộ ứng dụng
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Tự động load số lượng sản phẩm từ backend khi mở app
  useEffect(() => {
    axios.get("http://localhost:8080/api/cart/count", { withCredentials: true })
      .then((res) => {
        setCartCount(res.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy số lượng giỏ hàng khi khởi tạo:", err);
      });
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook tiện sử dụng
export const useCart = () => useContext(CartContext);
