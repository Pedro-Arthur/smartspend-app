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
  Fab,
  Modal,
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
import BankIcon from '../../assets/images/bank.svg';

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

  return dateString.split('-').reverse().join('/');
};

const getIconBySpendMethod = (key) => {
  switch (key) {
    case 'pix':
      return <PixIcon width={20} height={20} fill="#d97706" />;
    case 'ticket':
      return <MaterialCommunityIcons name="barcode-scan" />;
    case 'transfer':
      return <BankIcon width={20} height={20} fill="#d97706" />;
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
  if (spends.length > 5) {
    return 500;
  }
  return 'auto';
};

const Home = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');
  const customCardText = useColorModeValue('black', 'white');

  const { user } = useContext(AuthContext);
  const { spends, removeSpend } = useContext(DataContext);
  const { showToast } = useContext(ToastContext);
  const { token } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [saveSpendModalVisible, setSaveSpendModalVisible] = useState(false);
  const [detailsSpendModalVisible, setDetailsSpendModalVisible] = useState(false);
  const [currentSpendDetails, setCurrentSpendDetails] = useState(null);

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
                      <Text fontWeight="semibold" fontSize="md">
                        {formatDay(item.date)}
                      </Text>
                      <Text fontSize="xs">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.totalSpent)}
                      </Text>
                    </HStack>

                    <SwipeListView
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      data={item.values}
                      // eslint-disable-next-line no-shadow
                      renderItem={({ item }) => (
                        <HStack
                          bg={boxColor}
                          mt={4}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <HStack alignItems="center">
                            <Icon
                              mr={2}
                              color="primary.600"
                              fontSize={20}
                              as={getIconBySpendMethod(item.spendMethod.key)}
                            />

                            <VStack>
                              <Text>{item.spendMethod.name}</Text>
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
                        <HStack mt={4}>
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
                    />
                  </VStack>
                )}
                ItemSeparatorComponent={<Divider my={4} />}
              />
            </Box>
          )}
        </VStack>

        <Modal
          isOpen={detailsSpendModalVisible}
          size="xl"
          onClose={() => {
            setDetailsSpendModalVisible(false);
            closeRow(currentSpendDetails.rowMap, currentSpendDetails.id);
            setCurrentSpendDetails(null);
          }}
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Detalhes do gasto</Modal.Header>
            <Modal.Body>
              {currentSpendDetails && (
                <>
                  <HStack justifyContent="space-between">
                    <VStack>
                      <Text fontSize="xs" color="muted.400">
                        Valor
                      </Text>
                      <Text fontWeight="semibold" color={customCardText}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(currentSpendDetails.value)}
                      </Text>
                    </VStack>

                    <VStack>
                      <Text fontSize="xs" color="muted.400">
                        Data
                      </Text>
                      <Text fontWeight="semibold" color={customCardText}>
                        {currentSpendDetails.date.split('-').reverse().join('/')}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack mt={4} justifyContent="space-between">
                    <VStack>
                      <Text fontSize="xs" color="muted.400">
                        Categoria
                      </Text>
                      <Text fontWeight="semibold" color={customCardText}>
                        {currentSpendDetails.category.name}
                      </Text>
                    </VStack>

                    <VStack>
                      <Text fontSize="xs" color="muted.400">
                        Método
                      </Text>
                      <Text fontWeight="semibold" color={customCardText}>
                        {currentSpendDetails.spendMethod.name}
                      </Text>
                    </VStack>
                  </HStack>

                  {currentSpendDetails.spendMethod.key !== 'money' &&
                    currentSpendDetails.spendMethod.key !== 'ticket' && (
                      <>
                        {(currentSpendDetails.spendMethod.key === 'pix' ||
                          currentSpendDetails.spendMethod.key === 'transfer') && (
                          <>
                            <HStack mt={4} justifyContent="space-between">
                              <VStack>
                                <Text fontSize="xs" color="muted.400">
                                  Conta
                                </Text>
                                <Text fontWeight="semibold" color={customCardText}>
                                  {currentSpendDetails.bankAccount.number}-
                                  {currentSpendDetails.bankAccount.digit}
                                </Text>
                              </VStack>

                              <VStack>
                                <Text fontSize="xs" color="muted.400">
                                  Agência
                                </Text>
                                <Text fontWeight="semibold" color={customCardText}>
                                  {currentSpendDetails.bankAccount.agency}
                                </Text>
                              </VStack>
                            </HStack>

                            <HStack mt={4} justifyContent="space-between">
                              <VStack>
                                <Text fontSize="xs" color="muted.400">
                                  Banco
                                </Text>
                                <Text fontWeight="semibold" color={customCardText}>
                                  {currentSpendDetails.bankAccount.bank.name}
                                </Text>
                              </VStack>
                            </HStack>
                          </>
                        )}

                        {(currentSpendDetails.spendMethod.key === 'credit' ||
                          currentSpendDetails.spendMethod.key === 'debit') && (
                          <>
                            <HStack mt={4} justifyContent="space-between">
                              <VStack>
                                <Text fontSize="xs" color="muted.400">
                                  Cartão (Últimos 4 números)
                                </Text>
                                <Text fontWeight="semibold" color={customCardText}>
                                  {currentSpendDetails.bankCard.lastFourNumbers}
                                </Text>
                              </VStack>
                            </HStack>
                            <HStack mt={4} justifyContent="space-between">
                              <VStack>
                                <Text fontSize="xs" color="muted.400">
                                  Banco
                                </Text>
                                <Text fontWeight="semibold" color={customCardText}>
                                  {currentSpendDetails.bankCard.bankAccount.bank.name}
                                </Text>
                              </VStack>
                            </HStack>
                          </>
                        )}
                      </>
                    )}

                  <HStack mt={4} justifyContent="space-between">
                    <VStack>
                      <Text fontSize="xs" color="muted.400">
                        Descrição
                      </Text>
                      <Text fontWeight="semibold" color={customCardText}>
                        {currentSpendDetails.description}
                      </Text>
                    </VStack>
                  </HStack>
                </>
              )}
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Fab
          onPress={() => {
            setSaveSpendModalVisible(true);
          }}
          size="sm"
          icon={<Icon color="white" as={<MaterialIcons name="attach-money" />} size="sm" />}
          renderInPortal={false}
          bgColor="success.600"
        />
      </Box>

      <TermsModal />
    </>
  );
};

export default Home;
