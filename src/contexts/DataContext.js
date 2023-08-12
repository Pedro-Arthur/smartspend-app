import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorModeValue, Spinner, Center } from 'native-base';
import { ToastContext } from './ToastContext';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { showToast } = useContext(ToastContext);
  const { removeAuthIsLoggedIn, isLoggedIn } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankCards, setBankCards] = useState([]);

  const addBankAccount = (data) => {
    const currentBankAccounts = [...bankAccounts];
    currentBankAccounts.unshift(data);
    setBankAccounts(currentBankAccounts);
  };

  const updateBankAccount = (id, data) => {
    const indexToUpdate = bankAccounts.findIndex((i) => i.id === id);

    if (indexToUpdate !== -1) {
      const updatedBankAccounts = [...bankAccounts];
      updatedBankAccounts[indexToUpdate] = data;
      setBankAccounts(updatedBankAccounts);
    }
  };

  const removeBankAccount = (id) => {
    const filteredBankAccounts = bankAccounts.filter((i) => i.id !== id);
    setBankAccounts(filteredBankAccounts);
  };

  const addBankCard = (data) => {
    const currentBankCards = [...bankCards];
    currentBankCards.unshift(data);
    setBankCards(currentBankCards);
  };

  const updateBankCard = (id, data) => {
    const indexToUpdate = bankCards.findIndex((i) => i.id === id);

    if (indexToUpdate !== -1) {
      const updatedBankCards = [...bankCards];
      updatedBankCards[indexToUpdate] = data;
      setBankCards(updatedBankCards);
    }
  };

  const removeBankCard = (id) => {
    const filteredBankCards = bankCards.filter((i) => i.id !== id);
    setBankCards(filteredBankCards);
  };

  const contextValue = useMemo(
    () => ({
      banks,
      bankAccounts,
      addBankAccount,
      removeBankAccount,
      updateBankAccount,
      bankCards,
      addBankCard,
      updateBankCard,
      removeBankCard,
    }),
    [
      banks,
      bankAccounts,
      addBankAccount,
      removeBankAccount,
      updateBankAccount,
      bankCards,
      addBankCard,
      updateBankCard,
      removeBankCard,
    ]
  );

  const bg = useColorModeValue('warmGray.100', 'dark.50');

  const loadAuthenticatedData = async () => {
    const token = await AsyncStorage.getItem('@token');

    try {
      const [banksRes, bankAccountsRes, bankCardsRes] = await Promise.all([
        api.get('/banks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get('/bankAccounts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get('/bankCards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setBanks(banksRes);
      setBankAccounts(bankAccountsRes);
      setBankCards(bankCardsRes);
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
    if (isLoggedIn) {
      loadAuthenticatedData();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // Axios response interceptor
  api.interceptors.response.use(
    (response) => {
      if (response && response.data && typeof response.data === 'object') {
        return response.data;
      }
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
        await removeAuthIsLoggedIn();
      }
      return Promise.reject(error);
    }
  );

  if (isLoading) {
    return (
      <Center flex="1" bg={bg}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
