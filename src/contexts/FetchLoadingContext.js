import React, { createContext, useState, useMemo } from 'react';

export const FetchLoadingContext = createContext();

export const FetchLoadingProvider = ({ children }) => {
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  const setFetchLoading = (loading) => {
    setIsFetchLoading(loading);
  };

  const contextValue = useMemo(
    () => ({ isFetchLoading, setFetchLoading }),
    [isFetchLoading, setFetchLoading]
  );

  return (
    <FetchLoadingContext.Provider value={contextValue}>{children}</FetchLoadingContext.Provider>
  );
};
