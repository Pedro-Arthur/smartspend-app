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
  Modal,
  FormControl,
  TextArea,
  Select,
  CheckIcon,
  Input,
  ScrollView,
} from 'native-base';
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AccessibilityInfo, LogBox } from 'react-native';
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
import useKeyboard from '../../hooks/useKeyboard';
import CurrencyInput from '../../components/CurrencyInput';
import DatePickerInput from '../../components/DatePickerInput';
import GraphicSpendsPerMonth from '../../components/Graphics/SpendsPerMonth';
import SpendMethodsMostUsed from '../../components/Graphics/SpendMethodsMostUsed';

LogBox.ignoreLogs(['VirtualizedLists']);

const DeleteButton = (triggerProps) => (
  <Pressable
    accessible
    accessibilityRole="button"
    accessibilityHint="Deletar gasto"
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

const sumSpendsInMonth = (spends, month) => {
  const year = new Date().getFullYear();

  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const monthStart = `${year}-${monthStr}-01`;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextMonthYear = month === 12 ? year + 1 : year;
  const nextMonthStr = nextMonth < 10 ? `0${nextMonth}` : `${nextMonth}`;
  const monthEnd = `${nextMonthYear}-${nextMonthStr}-01`;

  return spends.reduce((sum, spend) => {
    if (spend.date >= monthStart && spend.date < monthEnd) {
      // eslint-disable-next-line no-param-reassign
      sum += parseFloat(spend.value);
    }
    return sum;
  }, 0);
};

const Home = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const { user } = useContext(AuthContext);
  const {
    spends,
    removeSpend,
    addSpend,
    bankAccounts,
    bankCards,
    categories,
    addCategory,
    spendMethods,
  } = useContext(DataContext);
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
    bankAccountId: null,
    customCategory: null,
  });
  const [formErrors, setFormErrors] = useState({
    description: null,
    value: null,
    date: null,
    categoryId: null,
    spendMethodId: null,
    bankCardId: null,
    bankAccountId: null,
    customCategory: null,
  });
  const [formType, setFormType] = useState(null);
  const [disableSpendMethodInput, setDisableSpendMethodInput] = useState(false);

  const onCloseSaveSpendModal = () => {
    setSaveSpendModalVisible(false);
    setFormData({
      description: null,
      value: 0,
      date: null,
      categoryId: null,
      spendMethodId: null,
      bankCardId: null,
      bankAccountId: null,
      customCategory: null,
    });
    setFormErrors({
      description: null,
      value: null,
      date: null,
      categoryId: null,
      spendMethodId: null,
      bankCardId: null,
      bankAccountId: null,
      customCategory: null,
    });
    setFormType(null);
    setDisableSpendMethodInput(false);
  };

  const saveSpend = async () => {
    const errors = {
      description: null,
      value: null,
      date: null,
      categoryId: null,
      spendMethodId: null,
      bankCardId: null,
      bankAccountId: null,
      customCategory: null,
    };

    if (!formData.description) {
      errors.description = 'Descrição é obrigatória!';
      AccessibilityInfo.announceForAccessibility('Descrição é obrigatória!');
    }

    if (!formData.value) {
      errors.value = 'O valor é obrigatório!';
      AccessibilityInfo.announceForAccessibility('O valor é obrigatório!');
    } else if (formData.value < 1) {
      errors.value = 'O valor precisa ser maior que R$ 1,00!';
      AccessibilityInfo.announceForAccessibility('O valor precisa ser maior que R$ 1,00!');
    } else if (formData.value > 9999999) {
      errors.value = 'O valor precisa ser menor que R$ 999.999,00!';
      AccessibilityInfo.announceForAccessibility('O valor precisa ser menor que R$ 999.999,00!');
    }

    if (!formData.date) {
      errors.date = 'Data é obrigatória!';
      AccessibilityInfo.announceForAccessibility('Data é obrigatória!');
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Categoria é obrigatória!';
      AccessibilityInfo.announceForAccessibility('Categoria é obrigatória!');
    }

    if (!formData.spendMethodId) {
      errors.spendMethodId = 'Método é obrigatório!';
      AccessibilityInfo.announceForAccessibility('Método é obrigatório!');
    }

    if (!formData.bankAccountId && (formType === 'pix' || formType === 'transfer')) {
      errors.bankAccountId = 'Conta é obrigatória!';
      AccessibilityInfo.announceForAccessibility('Conta é obrigatória!');
    }

    if (!formData.bankCardId && formType === 'card') {
      errors.bankCardId = 'Cartão é obrigatório!';
      AccessibilityInfo.announceForAccessibility('Cartão é obrigatório!');
    }

    if (formData.categoryId === 'new' && !formData.customCategory) {
      errors.customCategory = 'Categoria é obrigatória!';
      AccessibilityInfo.announceForAccessibility('Categoria é obrigatória!');
    }

    setFormErrors(errors);

    if (
      !errors.description &&
      !errors.value &&
      !errors.date &&
      !errors.categoryId &&
      !errors.spendMethodId &&
      !errors.bankAccountId &&
      !errors.bankCardId &&
      !errors.customCategory
    ) {
      try {
        setIsLoading(true);

        let spend;

        if (formData.categoryId === 'new') {
          const newCategory = await api.post(
            '/categories',
            { name: formData.customCategory },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          addCategory(newCategory);

          spend = await api.post(
            '/spends',
            { ...formData, categoryId: newCategory.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          spend = await api.post('/spends', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        addSpend({ ...spend, date: spend.date.length > 10 ? spend.date.slice(0, 10) : spend.date });

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

  const dataGraphicSpendsPerMonth1 = [];
  const dataGraphicSpendsPerMonth2 = [];

  // eslint-disable-next-line no-plusplus
  for (let month = 1; month <= 6; month++) {
    const sum = sumSpendsInMonth(spends, month);
    dataGraphicSpendsPerMonth1.push(sum);
  }

  // eslint-disable-next-line no-plusplus
  for (let month = 7; month <= 12; month++) {
    const sum = sumSpendsInMonth(spends, month);
    dataGraphicSpendsPerMonth2.push(sum);
  }

  const spendMethodsKeys = {
    pix: 'pix',
    money: 'money',
    credit: 'credit',
    debit: 'debit',
    transfer: 'transfer',
    ticket: 'ticket',
  };

  const dataGraphicMethodsMostUsed = Object.keys(spendMethodsKeys).map((methodKey) => {
    const spendsCount = spends.reduce(
      (count, s) => (s.spendMethod.key === spendMethodsKeys[methodKey] ? count + 1 : count),
      0
    );
    return {
      key: methodKey,
      spends: spendsCount,
    };
  });

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
    const foundSpendMethod = spendMethods.find((s) => s.key === type);

    if (foundSpendMethod) {
      setFormType(type);
      setFormData({ ...formData, spendMethodId: foundSpendMethod.id });
      setDisableSpendMethodInput(true);
      setSaveSpendModalVisible(true);
    } else {
      setFormType(type);
      setSaveSpendModalVisible(true);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
            <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor} mt={2}>
              <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                data={sortedAndGroupedSpends}
                keyExtractor={(spendGroup) => spendGroup.date}
                renderItem={({ item }) => (
                  <VStack>
                    <HStack accessible justifyContent="space-between" alignItems="center">
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

                    <Divider mb={4} mt={2} />

                    <SwipeListView
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      data={item.values}
                      // eslint-disable-next-line no-shadow
                      renderItem={({ item }) => (
                        <HStack
                          accessible
                          accessibilityHint="Deslize para a direita pra ter mais opções"
                          bg={boxColor}
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
                              <Text fontWeight="semibold">{item.spendMethod.name}</Text>
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
                            accessibilityRole="button"
                            accessibilityHint="Abrir modal de detalhes do gasto"
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
                            <Popover.Content
                              accessibilityLabel="Deletar gasto. Isso removerá os dados relacionados ao gasto. Esta ação não pode ser
                                revertida. Os dados excluídos não podem ser recuperados."
                              w="56"
                            >
                              <Popover.Arrow />
                              <Popover.CloseButton accessibilityLabel="Fechar menu de deletar gasto" />
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
                      ItemSeparatorComponent={<Box mb={4} />}
                    />
                  </VStack>
                )}
                ItemSeparatorComponent={<Box mb={4} />}
              />
            </Box>
          )}
        </VStack>

        <VStack mb={4}>
          <Text fontWeight="semibold" fontSize="md" mx={4}>
            Gastos por mês (1º semestre)
          </Text>
          <GraphicSpendsPerMonth
            data={dataGraphicSpendsPerMonth1}
            scale={['jan', 'fev', 'mar', 'abr', 'mai', 'jun']}
          />
        </VStack>

        <VStack mb={4}>
          <Text fontWeight="semibold" fontSize="md" mx={4}>
            Gastos por mês (2º semestre)
          </Text>
          <GraphicSpendsPerMonth
            data={dataGraphicSpendsPerMonth2}
            scale={['jul', 'ago', 'set', 'out', 'nov', 'dez']}
          />
        </VStack>

        <VStack mb={4}>
          <Text fontWeight="semibold" fontSize="md" mx={4}>
            Métodos mais usados
          </Text>
          <SpendMethodsMostUsed totalSpends={spends.length} data={dataGraphicMethodsMostUsed} />
        </VStack>

        <DetailsSpend
          detailsSpendModalVisible={detailsSpendModalVisible}
          setDetailsSpendModalVisible={setDetailsSpendModalVisible}
          closeRow={closeRow}
          setCurrentSpendDetails={setCurrentSpendDetails}
          currentSpendDetails={currentSpendDetails}
        />

        <AddSpendFab openSaveModal={openSaveModal} />

        <Modal
          isOpen={saveSpendModalVisible}
          onClose={() => onCloseSaveSpendModal()}
          pb={isKeyboardVisible ? keyboardHeight : 0}
          justifyContent="flex-end"
          bottom="4"
          size="xl"
        >
          <Modal.Content>
            <Modal.CloseButton accessibilityRole="button" accessibilityLabel="Fechar modal" />
            <Modal.Header>Salvar gasto</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <FormControl isRequired isInvalid={formErrors.description}>
                  <FormControl.Label>Descrição</FormControl.Label>
                  <TextArea
                    onChangeText={(value) => setFormData({ ...formData, description: value })}
                    value={formData.description}
                    maxLength={100}
                    placeholder="Insira uma descrição para o seu gasto"
                  />
                  {'description' in formErrors && (
                    <FormControl.ErrorMessage>{formErrors.description}</FormControl.ErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={formErrors.value}>
                  <FormControl.Label>Valor</FormControl.Label>
                  <CurrencyInput
                    onChangeText={(value) => setFormData({ ...formData, value })}
                    value={formData.value}
                    maxDigits={8}
                  />
                  {'value' in formErrors && (
                    <FormControl.ErrorMessage>{formErrors.value}</FormControl.ErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={formErrors.date}>
                  <FormControl.Label>Data</FormControl.Label>
                  <DatePickerInput
                    onChange={(value) => setFormData({ ...formData, date: value })}
                    value={formData.date}
                    placeholder="Selecione uma data"
                  />
                  {'date' in formErrors && (
                    <FormControl.ErrorMessage>{formErrors.date}</FormControl.ErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={formErrors.spendMethodId}>
                  <FormControl.Label>Método</FormControl.Label>
                  <Select
                    isDisabled={disableSpendMethodInput}
                    _selectedItem={{
                      bg: 'primary.600',
                      endIcon: <CheckIcon size="5" color="white" />,
                    }}
                    selectedValue={formData.spendMethodId}
                    accessibilityLabel="Selecione um método do gasto"
                    placeholder="Método"
                    onValueChange={(value) => setFormData({ ...formData, spendMethodId: value })}
                  >
                    {formType === 'card'
                      ? spendMethods
                          .filter((s) => s.key === 'debit' || s.key === 'credit')
                          .map((spendMethod) => (
                            <Select.Item
                              key={spendMethod.id}
                              label={spendMethod.name}
                              value={spendMethod.id}
                            />
                          ))
                      : spendMethods.map((spendMethod) => (
                          <Select.Item
                            key={spendMethod.id}
                            label={spendMethod.name}
                            value={spendMethod.id}
                          />
                        ))}
                  </Select>
                  {'spendMethodId' in formErrors && (
                    <FormControl.ErrorMessage>{formErrors.spendMethodId}</FormControl.ErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={formErrors.categoryId}>
                  <FormControl.Label>Categoria</FormControl.Label>
                  <Select
                    _selectedItem={{
                      bg: 'primary.600',
                      endIcon: <CheckIcon size="5" color="white" />,
                    }}
                    selectedValue={formData.categoryId}
                    accessibilityLabel="Selecione uma categoria"
                    placeholder="Categoria"
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <Select.Item
                      startIcon={
                        <Icon
                          mt={1}
                          _dark={{ color: 'white' }}
                          color="black"
                          fontSize={16}
                          name="plus"
                          as={AntDesign}
                        />
                      }
                      label="Adicionar nova categoria"
                      _text={{ fontWeight: 'semibold', _dark: { color: 'white' }, color: 'black' }}
                      value="new"
                    />
                    {categories.map((category) => (
                      <Select.Item key={category.id} label={category.name} value={category.id} />
                    ))}
                  </Select>
                  {'categoryId' in formErrors && (
                    <FormControl.ErrorMessage>{formErrors.categoryId}</FormControl.ErrorMessage>
                  )}
                </FormControl>

                {formData.categoryId === 'new' && (
                  <FormControl isRequired isInvalid={formErrors.customCategory}>
                    <FormControl.Label>Nova categoria</FormControl.Label>
                    <Input
                      onChangeText={(value) => setFormData({ ...formData, customCategory: value })}
                      value={formData.customCategory}
                      maxLength={50}
                      placeholder="Insira a nova categoria"
                    />
                    {'customCategory' in formErrors && (
                      <FormControl.ErrorMessage>
                        {formErrors.customCategory}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                )}

                {(formType === 'pix' || formType === 'transfer') && (
                  <FormControl isRequired isInvalid={formErrors.bankAccountId}>
                    <FormControl.Label>Conta bancária</FormControl.Label>
                    <Select
                      _selectedItem={{
                        bg: 'primary.600',
                        endIcon: <CheckIcon size="5" color="white" />,
                      }}
                      selectedValue={formData.bankAccountId}
                      accessibilityLabel="Selecione a conta bancária"
                      placeholder="Conta bancária"
                      onValueChange={(value) => setFormData({ ...formData, bankAccountId: value })}
                    >
                      {bankAccounts.map((bankAccount) => (
                        <Select.Item
                          key={bankAccount.id}
                          label={`${bankAccount.bank.name} (${bankAccount.number}-${bankAccount.digit})`}
                          value={bankAccount.id}
                        />
                      ))}
                    </Select>
                    {'bankAccountId' in formErrors && (
                      <FormControl.ErrorMessage>
                        {formErrors.bankAccountId}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                )}

                {formType === 'card' && (
                  <FormControl isRequired isInvalid={formErrors.bankCardId}>
                    <FormControl.Label>Cartão</FormControl.Label>
                    <Select
                      isDisabled={!formData.spendMethodId}
                      _selectedItem={{
                        bg: 'primary.600',
                        endIcon: <CheckIcon size="5" color="white" />,
                      }}
                      selectedValue={formData.bankCardId}
                      accessibilityLabel="Selecione o cartão"
                      placeholder="Cartão"
                      onValueChange={(value) => setFormData({ ...formData, bankCardId: value })}
                    >
                      {bankCards
                        .filter(
                          (bc) =>
                            bc.type ===
                            spendMethods.find((s) => s.id === formData.spendMethodId)?.key
                        )
                        .map((bankCard) => (
                          <Select.Item
                            key={bankCard.id}
                            label={`${bankCard.bankAccount.bank.name} (Final ${bankCard.lastFourNumbers})`}
                            value={bankCard.id}
                          />
                        ))}
                    </Select>
                    {'bankCardId' in formErrors && (
                      <FormControl.ErrorMessage>{formErrors.bankCardId}</FormControl.ErrorMessage>
                    )}
                  </FormControl>
                )}
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <Button
                flex="1"
                onPress={() => {
                  saveSpend();
                }}
                isLoading={isLoading}
              >
                Salvar
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>

      <TermsModal />
    </ScrollView>
  );
};

export default Home;
