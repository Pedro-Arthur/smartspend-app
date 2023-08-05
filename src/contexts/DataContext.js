import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { useColorModeValue, Spinner, Center } from 'native-base';
import { ToastContext } from './ToastContext';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { showToast } = useContext(ToastContext);
  const { token, isLoggedIn } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState([]);

  const contextValue = useMemo(
    () => ({
      banks,
    }),
    [banks]
  );

  const bg = useColorModeValue('warmGray.100', 'dark.50');

  const loadAuthenticatedData = async () => {
    try {
      const [banksRes] = await Promise.all([
        api.get('/banks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setBanks(banksRes);
    } catch (error) {
      showToast({
        title: 'Ops!',
        description: error?.response?.data?.message || 'Erro ao carregar dados!',
        variant: 'solid',
        isClosable: true,
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadAuthenticatedData();
    else setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Center flex="1" bg={bg}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
