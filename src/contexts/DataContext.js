import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorModeValue, Spinner, Center } from 'native-base';
import { ToastContext } from './ToastContext';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const DataContext = createContext();

const addItem = (data, list, setList) => {
  const currentList = [...list];
  currentList.unshift(data);
  setList(currentList);
};

const updateItem = (id, data, list, setList) => {
  const indexToUpdate = list.findIndex((i) => i.id === id);

  if (indexToUpdate !== -1) {
    const updatedList = [...list];
    updatedList[indexToUpdate] = data;
    setList(updatedList);
  }
};

const removeItem = (id, list, setList) => {
  const filteredList = list.filter((i) => i.id !== id);
  setList(filteredList);
};

export const DataProvider = ({ children }) => {
  const { showToast } = useContext(ToastContext);
  const { removeAuthIsLoggedIn, isLoggedIn } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankCards, setBankCards] = useState([]);
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [spends, setSpends] = useState([]);
  const [spendMethods, setSpendMethods] = useState([]);

  const addBankAccount = (data) => addItem(data, bankAccounts, setBankAccounts);
  const updateBankAccount = (id, data) => updateItem(id, data, bankAccounts, setBankAccounts);
  const removeBankAccount = (id) => removeItem(id, bankAccounts, setBankAccounts);
  const refreshBankAccounts = async () => {
    const token = await AsyncStorage.getItem('@token');
    const bankAccountsRes = await api.get('/bankAccounts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBankAccounts(bankAccountsRes);
  };

  const addBankCard = (data) => addItem(data, bankCards, setBankCards);
  const updateBankCard = (id, data) => updateItem(id, data, bankCards, setBankCards);
  const removeBankCard = (id) => removeItem(id, bankCards, setBankCards);
  const refreshBankCards = async () => {
    const token = await AsyncStorage.getItem('@token');
    const bankCardsRes = await api.get('/bankCards', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBankCards(bankCardsRes);
  };

  const addGoal = (data) => addItem(data, goals, setGoals);
  const removeGoal = (id) => removeItem(id, goals, setGoals);
  const refreshGoals = async () => {
    const token = await AsyncStorage.getItem('@token');
    const goalsRes = await api.get('/goals', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setGoals(goalsRes);
  };

  const addCategory = (data) => addItem(data, categories, setCategories);

  const addSpend = (data) => addItem(data, spends, setSpends);
  const updateSpend = (id, data) => updateItem(id, data, spends, setSpends);
  const removeSpend = (id) => removeItem(id, spends, setSpends);
  const refreshSpends = async () => {
    const token = await AsyncStorage.getItem('@token');
    const spendsRes = await api.get('/spends', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSpends(spendsRes);
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
      goals,
      addGoal,
      removeGoal,
      refreshGoals,
      refreshBankCards,
      refreshBankAccounts,
      categories,
      addCategory,
      spendMethods,
      spends,
      addSpend,
      removeSpend,
      updateSpend,
      refreshSpends,
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
      goals,
      addGoal,
      removeGoal,
      refreshGoals,
      refreshBankCards,
      refreshBankAccounts,
      categories,
      addCategory,
      spendMethods,
      spends,
      addSpend,
      removeSpend,
      updateSpend,
      refreshSpends,
    ]
  );

  const bg = useColorModeValue('warmGray.100', 'dark.50');

  const loadAuthenticatedData = async () => {
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('@token');

      const [
        banksRes,
        bankAccountsRes,
        bankCardsRes,
        goalsRes,
        categoriesRes,
        spendsRes,
        spendMethodsRes,
      ] = await Promise.all([
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
        api.get('/goals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get('/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get('/spends', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get('/spendMethods', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setBanks(banksRes);
      setBankAccounts(bankAccountsRes);
      setBankCards(bankCardsRes);
      setGoals(goalsRes);
      setCategories(categoriesRes);
      setSpends(spendsRes);
      setSpendMethods(spendMethodsRes);
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
