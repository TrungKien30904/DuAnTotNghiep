// LoadingContext.js
import React, { createContext, useState, useContext } from 'react';

// Create Context
const LoadingContext = createContext();

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Context provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const setLoadingState = (state) => setLoading(state);

  return (
    <LoadingContext.Provider value={{ loading, setLoadingState }}>
      {children}
    </LoadingContext.Provider>
  );
};
