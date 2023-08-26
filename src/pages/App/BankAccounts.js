import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  useColorModeValue,
  Center,
  Text,
  Box,
  VStack,
  Fab,
  Icon,
  Popover,
  Button,
  Image,
  Modal,
  FormControl,
  Input,
  Select,
  CheckIcon,
  HStack,
  Pressable,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { DataContext } from '../../contexts/DataContext';
import api from '../../services/api';
import { ToastContext } from '../../contexts/ToastContext';
import { AuthContext } from '../../contexts/AuthContext';
import useKeyboard from '../../hooks/useKeyboard';

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

const BankAccounts = () => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');
  const customCardText = useColorModeValue('black', 'white');

  const {
    banks,
    bankAccounts,
    removeBankAccount,
    addBankAccount,
    updateBankAccount,
    refreshBankAccounts,
  } = useContext(DataContext);
  const { showToast } = useContext(ToastContext);
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    number: null,
    digit: null,
    agency: null,
    bankId: null,
  });
  const [formErrors, setFormErrors] = useState({
    number: null,
    digit: null,
    agency: null,
    bankId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveBankAccountModalVisible, setSaveBankAccountModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredBankAccounts, setFilteredBankAccounts] = useState(bankAccounts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshBankAccounts();
    setRefreshing(false);
  }, []);

  const handleSearch = (searchText) => {
    setSearch(searchText);
    setFilteredBankAccounts(
      bankAccounts.filter(
        (i) =>
          i.number.match(searchText) ||
          i.agency.match(searchText) ||
          i.bank.name.toLowerCase().match(searchText.toLowerCase())
      )
    );
  };

  const onCloseSaveBankAccountModal = () => {
    setSaveBankAccountModalVisible(false);
    setFormData({
      number: null,
      digit: null,
      agency: null,
      bankId: null,
    });
    setFormErrors({
      number: null,
      digit: null,
      agency: null,
      bankId: null,
    });
  };

  const saveBankAccount = async () => {
    const errors = {
      number: null,
      digit: null,
      agency: null,
      bankId: null,
    };

    if (!formData.number) {
      errors.number = 'Número é obrigatório!';
    }

    if (!formData.digit) {
      errors.digit = 'Dígito é obrigatório!';
    }

    if (!formData.agency) {
      errors.agency = 'Agência é obrigatória!';
    } else if (formData.agency.length < 4) {
      errors.agency = 'Agência deve possuir 4 números!';
    }

    if (!formData.bankId) {
      errors.bankId = 'Banco é obrigatório!';
    }

    setFormErrors(errors);

    if (!errors.number && !errors.digit && !errors.agency && !errors.bankId) {
      try {
        setIsLoading(true);

        if (!formData.id) {
          const bankAccount = await api.post('/bankAccounts', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          addBankAccount(bankAccount);
        } else {
          const bankAccount = await api.patch(`/bankAccounts/${formData.id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          updateBankAccount(formData.id, bankAccount);
        }

        showToast({
          title: 'Sucesso!',
          description: 'Conta salva com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        onCloseSaveBankAccountModal();
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao salvar conta!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteAccount = async (id) => {
    try {
      setIsLoading(true);

      await api.delete(`/bankAccounts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      removeBankAccount(id);

      showToast({
        title: 'Sucesso!',
        description: 'Conta deletada com sucesso!',
        variant: 'solid',
        isClosable: true,
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Ops!',
        description: error?.response?.data?.message || 'Erro ao deletar conta!',
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

  useEffect(() => {
    setSearch('');
    setFilteredBankAccounts(bankAccounts);
  }, [bankAccounts]);

  return (
    <Box flex="1" bg={bg}>
      <Center my="4">
        <Text>CONTAS</Text>
      </Center>

      <Input
        InputRightElement={
          <Icon as={<AntDesign name="search1" />} size={5} mr="2" color="muted.400" />
        }
        mx={4}
        mb={4}
        placeholder="Pesquisa..."
        value={search}
        onChangeText={handleSearch}
      />

      {filteredBankAccounts.length === 0 && (
        <Center position="absolute" alignSelf="center" h="100%">
          <Image w="100" h="100" source={require('../../assets/images/empty.png')} alt="empty" />
          <Text mt="2">Nenhuma conta encontrada...</Text>
        </Center>
      )}

      <SwipeListView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={filteredBankAccounts}
        renderItem={({ item }) => (
          <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor} mb={4}>
            <VStack>
              <Text fontWeight="semibold" fontSize="md" color="primary.600">
                {item.bank.name}
              </Text>

              <HStack mt={4} justifyContent="space-between">
                <VStack>
                  <Text fontSize="xs" color="muted.400">
                    Número
                  </Text>
                  <Text fontWeight="semibold" color={customCardText}>
                    {item.number}
                  </Text>
                </VStack>

                <VStack>
                  <Text fontSize="xs" color="muted.400">
                    Dígito
                  </Text>
                  <Text fontWeight="semibold" color={customCardText}>
                    {item.digit}
                  </Text>
                </VStack>
              </HStack>

              <Text mt={4} fontSize="xs" color="muted.400">
                Agência
              </Text>
              <Text fontWeight="semibold" color={customCardText}>
                {item.agency}
              </Text>
            </VStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
        renderHiddenItem={(data, rowMap) => (
          <HStack mx={4} mb={4}>
            <Pressable
              borderTopLeftRadius={8}
              borderBottomLeftRadius={8}
              px={4}
              ml="auto"
              bg="dark.500"
              justifyContent="center"
              onPress={() => closeRow(rowMap, data.item.id)}
              _pressed={{
                opacity: 0.5,
              }}
            >
              <Icon as={<AntDesign name="close" />} color="white" />
            </Pressable>
            <Pressable
              px={4}
              bg="primary.600"
              justifyContent="center"
              onPress={() => {
                setFormData({ ...data.item, bankId: data.item.bank.id });
                setSaveBankAccountModalVisible(true);
              }}
              _pressed={{
                opacity: 0.5,
              }}
            >
              <Icon as={<AntDesign name="edit" />} color="white" />
            </Pressable>
            <Popover trigger={DeleteButton}>
              <Popover.Content accessibilityLabel="Deletar conta" w="56">
                <Popover.Arrow />
                <Popover.CloseButton />
                <Popover.Header>Deletar conta</Popover.Header>
                <Popover.Body>
                  Isso removerá os dados relacionados à conta. Esta ação não pode ser revertida. Os
                  dados excluídos não podem ser recuperados.
                </Popover.Body>
                <Popover.Footer justifyContent="flex-end">
                  <Button.Group>
                    <Button
                      isLoading={isLoading}
                      onPress={() => deleteAccount(data.item.id)}
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
        rightOpenValue={-147}
      />

      <Fab
        onPress={() => {
          setSaveBankAccountModalVisible(true);
        }}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        renderInPortal={false}
      />

      <Modal
        isOpen={saveBankAccountModalVisible}
        onClose={() => onCloseSaveBankAccountModal()}
        pb={isKeyboardVisible ? keyboardHeight : 0}
        justifyContent="flex-end"
        bottom="4"
        size="xl"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Salvar conta</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <FormControl isRequired isInvalid={formErrors.number}>
                <FormControl.Label>Número</FormControl.Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={(value) => setFormData({ ...formData, number: value })}
                  value={formData.number}
                  maxLength={10}
                  placeholder="Número da sua conta"
                />
                {'number' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.number}</FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.digit}>
                <FormControl.Label>Dígito</FormControl.Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={(value) => setFormData({ ...formData, digit: value })}
                  value={formData.digit}
                  maxLength={1}
                  placeholder="Dígito da sua conta"
                />
                {'digit' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.digit}</FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.agency}>
                <FormControl.Label>Agência</FormControl.Label>
                <Input
                  keyboardType="numeric"
                  onChangeText={(value) => setFormData({ ...formData, agency: value })}
                  value={formData.agency}
                  maxLength={4}
                  placeholder="Agência da sua conta"
                />
                {'agency' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.agency}</FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.bankId}>
                <FormControl.Label>Banco</FormControl.Label>
                <Select
                  _selectedItem={{
                    bg: 'primary.600',
                    endIcon: <CheckIcon size="5" color="white" />,
                  }}
                  selectedValue={formData.bankId}
                  accessibilityLabel="Banco da conta"
                  placeholder="Banco da conta"
                  onValueChange={(value) => setFormData({ ...formData, bankId: value })}
                >
                  {banks.map((bank) => (
                    <Select.Item
                      key={bank.id}
                      label={`${bank.name} (${bank.code})`}
                      value={bank.id}
                    />
                  ))}
                </Select>
                {'bankId' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.bankId}</FormControl.ErrorMessage>
                )}
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                saveBankAccount();
              }}
              isLoading={isLoading}
            >
              Salvar
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default BankAccounts;
