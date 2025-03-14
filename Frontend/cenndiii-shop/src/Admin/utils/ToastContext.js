import React, { createContext, useContext } from "react";
import { toast } from "react-toastify";

// Create a ToastContext to store toast functionality
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        pauseOnHover: true
      });
    } else if (type === "error") {
      toast.error(message, {
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        pauseOnHover: true
      });
    } else if (type === "info") {
      toast.info(message, {
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        pauseOnHover: true
      });
    } else if (type === "warning") {
      toast.warning(message, {
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        pauseOnHover: true
      });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
