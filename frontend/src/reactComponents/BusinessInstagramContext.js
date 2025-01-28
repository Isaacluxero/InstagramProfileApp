import React, { createContext, useState } from 'react';
export const BusinessInstagramContext = createContext();

// Create a provider component
export const BusinessInstagramProvider = ({ children }) => {
  const [businessInstagramId, setBusinessInstagramId] = useState(null);

  return (
    <BusinessInstagramContext.Provider value={{ businessInstagramId, setBusinessInstagramId }}>
      {children}
    </BusinessInstagramContext.Provider>
  );
};

