import React, { createContext, useState, useMemo } from 'react';

export const FetchLoadingContext = createContext();

export const FetchLoadingProvider = ({ children }) => {
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  const contextValue = useMemo(
    () => ({ isFetchLoading, setIsFetchLoading }),
    [isFetchLoading, setIsFetchLoading]
  );

  return (
    <FetchLoadingContext.Provider value={contextValue}>{children}</FetchLoadingContext.Provider>
  );
};
