import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './User/pages/cart/CartContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CartProvider>  {/* Thêm Provider vào đây */}
      <App />
    </CartProvider>
  </React.StrictMode>
);

reportWebVitals();
