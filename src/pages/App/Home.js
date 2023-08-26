import React, { useContext, useState } from 'react';
import {
  useColorModeValue,
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  Divider,
  FlatList,
  Icon,
  Pressable,
  Popover,
  Button,
} from 'native-base';
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import TermsModal from '../../components/TermsModal';
import TipsCarousel from '../../components/TipsCarousel';
import { getGreeting } from '../../utils/helpers';
import { AuthContext } from '../../contexts/AuthContext';
import { DataContext } from '../../contexts/DataContext';
import { ToastContext } from '../../contexts/ToastContext';
import api from '../../services/api';
import PixIcon from '../../assets/images/pix.svg';
import DetailsSpend from '../../components/DetailsSpend';
import AddSpendFab from '../../components/AddSpendFab';

const DeleteButton = (triggerProps) => (
  <Pressable
    {...triggerProps}
    px={4}
    borderTopRightRadius={8}
    borderBottomRightRadius={8}
    height="full"
    bgColor="danger.600"
    justifyContent="center"
    _pressed={{
      opacity: 0.5,
    }}
  >
    <Icon as={<AntDesign name="delete" />} color="white" />
  </Pressable>
);

const groupAndSortSpends = (spends) => {
  const groupedSpends = spends.reduce((groups, spend) => {
    const group = groups[spend.date] || [];
    group.push(spend);
    // eslint-disable-next-line no-param-reassign
    groups[spend.date] = group;
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedSpends).sort((a, b) => b.localeCompare(a));

  const finalList = sortedDates.map((date) => {
    const values = groupedSpends[date];

    const totalSpent = values.reduce((total, obj) => {
      const numberValue = parseFloat(`${obj.value}`);
      return total + numberValue;
    }, 0);

    return {
      totalSpent,
      date,
      values,
    };
  });

  return finalList;
};

const formatDay = (dateString) => {
  const today = new Date();

  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }

  const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const months = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];

  const dayOfWeek = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek}, ${day} ${month} ${year}`;
};

const getIconBySpendMethod = (key) => {
  switch (key) {
    case 'pix':
      return <PixIcon width={16} height={16} fill="#d97706" />;
    case 'ticket':
      return <MaterialCommunityIcons name="barcode-scan" />;
    case 'transfer':
      return <MaterialCommunityIcons name="bank-outline" />;
    case 'debit':
      return <AntDesign name="creditcard" />;
    case 'credit':
      return <AntDesign name="creditcard" />;
    case 'money':
      return <MaterialIcons name="attach-money" />;
    default:
      return <MaterialIcons name="attach-money" />;
  }
};

const getHistoricSpendsHeight = (spends) => {
  if (spends.length > 8) {
    return 500;
  }
  return 'auto';
};

const Home = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');

  const { user } = useContext(AuthContext);
  const { spends, removeSpend, addSpend } = useContext(DataContext);
  const { showToast } = useContext(ToastContext);
  const { token } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [saveSpendModalVisible, setSaveSpendModalVisible] = useState(false);
  const [detailsSpendModalVisible, setDetailsSpendModalVisible] = useState(false);
  const [currentSpendDetails, setCurrentSpendDetails] = useState(null);
  const [formData, setFormData] = useState({
    description: null,
    value: 0,
    date: null,
    categoryId: null,
    spendMethodId: null,
    bankCardId: null,
    bankAccounId: null,
  });
  const [formErrors, setFormErrors] = useState({
    description: null,
    value: null,
    date: null,
    categoryId: null,
    spendMethodId: null,
    bankCardId: null,
    bankAccounId: null,
  });
  const [formType, setFormType] = useState(null);

  const onCloseSaveSpendModal = () => {
    setSaveSpendModalVisible(false);
    setFormData({
      description: null,
      value: 0,
      date: null,
      categoryId: null,
      spendMethodId: null,
      bankCardId: null,
      bankAccounId: null,
    });
    setFormErrors({
      description: null,
      value: null,
      date: null,
      categoryId: null,
      spendMethodId: null,
      bankCardId: null,
      bankAccounId: null,
    });
  };

  const saveSpend = async () => {
    const errors = {
      description: null,
      value: null,
      date: null,
      categoryId: null,
      spendMethodId: null,
      bankCardId: null,
      bankAccounId: null,
    };

    if (!formData.description) {
      errors.description = 'Descrição é obrigatória!';
    }

    setFormErrors(errors);

    if (!errors.description) {
      try {
        setIsLoading(true);

        const spend = await api.post('/spends', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        addSpend(spend);

        showToast({
          title: 'Sucesso!',
          description: 'Gasto salvo com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        onCloseSaveSpendModal();
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao salvar gasto!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const greeting = getGreeting();
  const sortedAndGroupedSpends = groupAndSortSpends(spends);

  const deleteSpend = async (id) => {
    try {
      setIsLoading(true);

      await api.delete(`/spends/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      removeSpend(id);

      showToast({
        title: 'Sucesso!',
        description: 'Gasto deletado com sucesso!',
        variant: 'solid',
        isClosable: true,
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Ops!',
        description: error?.response?.data?.message || 'Erro ao deletar gasto!',
        variant: 'solid',
        isClosable: true,
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const openSaveModal = (type) => {
    setFormType(type);
    setSaveSpendModalVisible(true);
  };

  return (
    <>
      <Box flex="1" bg={bg}>
        <Heading size="lg" fontWeight="600" mx={4} mt={4}>
          {greeting}, {user && user.name}!
        </Heading>

        <VStack>
          <Text fontWeight="semibold" fontSize="md" mx={4} mt={4}>
            Dicas de saúde financeira
          </Text>
          <TipsCarousel />
        </VStack>

        <VStack mb={4}>
          <Text fontWeight="semibold" fontSize="md" mx={4}>
            Histórico de gastos
          </Text>

          {sortedAndGroupedSpends.length === 0 ? (
            <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor} mt={2}>
              <Text>Nenhum gasto encontrado...</Text>
            </Box>
          ) : (
            <Box
              h={getHistoricSpendsHeight(spends)}
              shadow={2}
              mx={4}
              p={4}
              borderRadius={8}
              bg={boxColor}
              mt={2}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                data={sortedAndGroupedSpends}
                keyExtractor={(spendGroup) => spendGroup.date}
                renderItem={({ item }) => (
                  <VStack>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="xs">{formatDay(item.date)}</Text>

                      <HStack>
                        <Text fontSize="xs">Gasto do dia: </Text>
                        <Text fontSize="xs" fontWeight="semibold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.totalSpent)}
                        </Text>
                      </HStack>
                    </HStack>

                    <Divider my={2} />

                    <SwipeListView
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      data={item.values}
                      // eslint-disable-next-line no-shadow
                      renderItem={({ item }) => (
                        <HStack bg={boxColor} justifyContent="space-between" alignItems="center">
                          <HStack alignItems="center">
                            <Icon
                              mr={2}
                              color="primary.600"
                              fontSize={20}
                              as={getIconBySpendMethod(item.spendMethod.key)}
                            />

                            <VStack>
                              <Text fontWeight="semibold" fontSize="xs">
                                {item.spendMethod.name}
                              </Text>
                              <Text fontSize="xs">{item.category.name}</Text>
                            </VStack>
                          </HStack>

                          <Text>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.value)}
                          </Text>
                        </HStack>
                      )}
                      keyExtractor={(spend) => spend.id}
                      renderHiddenItem={(data, rowMap) => (
                        <HStack>
                          <Pressable
                            borderTopLeftRadius={8}
                            borderBottomLeftRadius={8}
                            px={4}
                            ml="auto"
                            bg="dark.500"
                            justifyContent="center"
                            _pressed={{
                              opacity: 0.5,
                            }}
                            onPress={() => {
                              setCurrentSpendDetails({
                                ...data.item,
                                rowMap,
                              });
                              setDetailsSpendModalVisible(true);
                            }}
                          >
                            <Icon as={<AntDesign name="infocirlceo" />} color="white" />
                          </Pressable>
                          <Popover trigger={DeleteButton}>
                            <Popover.Content accessibilityLabel="Deletar gasto" w="56">
                              <Popover.Arrow />
                              <Popover.CloseButton />
                              <Popover.Header>Deletar gasto</Popover.Header>
                              <Popover.Body>
                                Isso removerá os dados relacionados ao gasto. Esta ação não pode ser
                                revertida. Os dados excluídos não podem ser recuperados.
                              </Popover.Body>
                              <Popover.Footer justifyContent="flex-end">
                                <Button.Group>
                                  <Button
                                    onPress={() => deleteSpend(data.item.id)}
                                    isLoading={isLoading}
                                    colorScheme="danger"
                                  >
                                    Deletar
                                  </Button>
                                </Button.Group>
                              </Popover.Footer>
                            </Popover.Content>
                          </Popover>
                        </HStack>
                      )}
                      rightOpenValue={-100}
                      ItemSeparatorComponent={<Box mb={2} />}
                    />
                  </VStack>
                )}
                ItemSeparatorComponent={<Box mb={4} />}
              />
            </Box>
          )}
        </VStack>

        <DetailsSpend
          detailsSpendModalVisible={detailsSpendModalVisible}
          setDetailsSpendModalVisible={setDetailsSpendModalVisible}
          closeRow={closeRow}
          setCurrentSpendDetails={setCurrentSpendDetails}
          currentSpendDetails={currentSpendDetails}
        />

        <AddSpendFab openSaveModal={openSaveModal} />
      </Box>

      <TermsModal />
    </>
  );
};

export default Home;
