import React from 'react';
import ReactDOM from 'react-dom/client'; // Import đúng module cho React 18
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Tạo root container
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render ứng dụng
root.render(
  <React.StrictMode >
      <App/>
  </React.StrictMode>
);

// Tùy chọn đo hiệu năng
reportWebVitals();
