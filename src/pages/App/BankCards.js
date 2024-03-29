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
  IconButton,
  Pressable,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { AccessibilityInfo, RefreshControl } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { DataContext } from '../../contexts/DataContext';
import api from '../../services/api';
import { ToastContext } from '../../contexts/ToastContext';
import { AuthContext } from '../../contexts/AuthContext';
import useKeyboard from '../../hooks/useKeyboard';

const DeleteButton = (triggerProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Deletar cartão"
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

const InfoIconButton = (triggerProps) => (
  <IconButton
    {...triggerProps}
    accessible
    accessibilityRole="button"
    accessibilityLabel="Botão para ver uma informação sobre a caixa de texto dos últimos 4 números"
    variant="unstyled"
    _icon={{
      as: AntDesign,
      name: 'infocirlceo',
      size: 'sm',
      color: 'muted.400',
      ml: 2,
    }}
    width="0"
  />
);

const BankCards = () => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');
  const customCardText = useColorModeValue('black', 'white');

  const { bankAccounts, bankCards, removeBankCard, addBankCard, updateBankCard, refreshBankCards } =
    useContext(DataContext);
  const { showToast } = useContext(ToastContext);
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    lastFourNumbers: null,
    type: null,
    bankAccountId: null,
  });
  const [formErrors, setFormErrors] = useState({
    lastFourNumbers: null,
    type: null,
    bankAccountId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveBankCardModalVisible, setSaveBankCardModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredBankCards, setFilteredBankCards] = useState(bankCards);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshBankCards();
    setRefreshing(false);
  }, []);

  const handleSearch = (searchText) => {
    setSearch(searchText);
    setFilteredBankCards(
      bankCards.filter(
        (i) =>
          i.lastFourNumbers.match(searchText) ||
          i.bankAccount.bank.name.toLowerCase().match(searchText.toLowerCase())
      )
    );
  };

  const onCloseSaveBankCardModal = () => {
    setSaveBankCardModalVisible(false);
    setFormData({
      lastFourNumbers: null,
      type: null,
      bankAccountId: null,
    });
    setFormErrors({
      lastFourNumbers: null,
      type: null,
      bankAccountId: null,
    });
  };

  const saveBankCard = async () => {
    const errors = {
      lastFourNumbers: null,
      type: null,
      bankAccountId: null,
    };

    if (!formData.lastFourNumbers || formData.lastFourNumbers.length < 4) {
      errors.lastFourNumbers = 'Os últimos 4 números são obrigatórios!';
      AccessibilityInfo.announceForAccessibility('Os últimos 4 números são obrigatórios!');
    }

    if (!formData.type) {
      errors.type = 'Tipo do cartão é obrigatório!';
      AccessibilityInfo.announceForAccessibility('Tipo do cartão é obrigatório!');
    }

    if (!formData.bankAccountId) {
      errors.bankAccountId = 'Conta bancária é obrigatória!';
      AccessibilityInfo.announceForAccessibility('Conta bancária é obrigatória!');
    }

    setFormErrors(errors);

    if (!errors.lastFourNumbers && !errors.type && !errors.bankAccountId) {
      try {
        setIsLoading(true);

        if (!formData.id) {
          const bankCard = await api.post('/bankCards', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          addBankCard(bankCard);
        } else {
          const bankCard = await api.patch(`/bankCards/${formData.id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          updateBankCard(formData.id, bankCard);
        }

        showToast({
          title: 'Sucesso!',
          description: 'Cartão salvo com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        onCloseSaveBankCardModal();
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao salvar cartão!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteCard = async (id) => {
    try {
      setIsLoading(true);

      await api.delete(`/bankCards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      removeBankCard(id);

      showToast({
        title: 'Sucesso!',
        description: 'Cartão deletado com sucesso!',
        variant: 'solid',
        isClosable: true,
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Ops!',
        description: error?.response?.data?.message || 'Erro ao deletar cartão!',
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
    setFilteredBankCards(bankCards);
  }, [bankCards]);

  return (
    <Box flex="1" bg={bg}>
      <Center my="4">
        <Text accessibilityLabel="Seus cartões bancários">CARTÕES</Text>
      </Center>

      <Input
        InputRightElement={
          <Icon as={<AntDesign name="search1" />} size={5} mr="2" color="muted.400" />
        }
        mx={4}
        mb={4}
        placeholder="Pesquise por algum cartão"
        value={search}
        onChangeText={handleSearch}
      />

      {filteredBankCards.length === 0 && (
        <Center position="absolute" alignSelf="center" h="100%">
          <Image
            accessibilityRole="image"
            accessibilityLabel="Imagem representando que a lista está vazia"
            w="100"
            h="100"
            source={require('../../assets/images/empty.png')}
            alt="empty"
          />
          <Text mt="2">Nenhum cartão encontrado...</Text>
        </Center>
      )}

      <SwipeListView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={filteredBankCards}
        renderItem={({ item }) => (
          <Box
            accessible
            accessibilityHint="Deslize para a direita pra ter mais opções"
            shadow={2}
            mx={4}
            p={4}
            borderRadius={8}
            bg={boxColor}
            mb={4}
          >
            <VStack>
              <Text fontWeight="semibold" fontSize="md" color="primary.600">
                {item.bankAccount.bank.name}
              </Text>

              <HStack mt={4} justifyContent="space-between">
                <VStack>
                  <Text fontSize="xs" color="muted.400">
                    Últimos 4 números
                  </Text>
                  <Text fontWeight="semibold" color={customCardText}>
                    {item.lastFourNumbers}
                  </Text>
                </VStack>

                <VStack>
                  <Text fontSize="xs" color="muted.400">
                    Tipo
                  </Text>
                  <Text fontWeight="semibold" color={customCardText}>
                    {item.type === 'credit' ? 'Crédito' : 'Débito'}
                  </Text>
                </VStack>
              </HStack>

              <HStack mt={4} justifyContent="space-between">
                <VStack>
                  <Text fontSize="xs" color="muted.400">
                    Conta
                  </Text>
                  <Text fontWeight="semibold" color={customCardText}>
                    {item.bankAccount.number}-{item.bankAccount.digit}
                  </Text>
                </VStack>

                <VStack>
                  <Text fontSize="xs" color="muted.400">
                    Agência
                  </Text>
                  <Text fontWeight="semibold" color={customCardText}>
                    {item.bankAccount.agency}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
        renderHiddenItem={(data, rowMap) => (
          <HStack mx={4} mb={4}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar menu de opções"
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
              accessibilityRole="button"
              accessibilityLabel="Editar cartão"
              px={4}
              bg="primary.600"
              justifyContent="center"
              onPress={() => {
                setFormData({ ...data.item, bankAccountId: data.item.bankAccount.id });
                setSaveBankCardModalVisible(true);
              }}
              _pressed={{
                opacity: 0.5,
              }}
            >
              <Icon as={<AntDesign name="edit" />} color="white" />
            </Pressable>
            <Popover trigger={DeleteButton}>
              <Popover.Content
                accessibilityLabel="Deletar cartão. Isso removerá os dados relacionados ao cartão. Esta ação não pode ser revertida.
                  Os dados excluídos não podem ser recuperados."
                w="56"
              >
                <Popover.Arrow />
                <Popover.CloseButton
                  accessibilityRole="button"
                  accessibilityLabel="Fechar menu de deletar cartão"
                />
                <Popover.Header>Deletar cartão</Popover.Header>
                <Popover.Body>
                  Isso removerá os dados relacionados ao cartão. Esta ação não pode ser revertida.
                  Os dados excluídos não podem ser recuperados.
                </Popover.Body>
                <Popover.Footer justifyContent="flex-end">
                  <Button.Group>
                    <Button
                      isLoading={isLoading}
                      onPress={() => deleteCard(data.item.id)}
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
          setSaveBankCardModalVisible(true);
        }}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        renderInPortal={false}
        accessibilityRole="button"
        accessibilityLabel="Abrir modal para adicionar cartão"
      />

      <Modal
        isOpen={saveBankCardModalVisible}
        onClose={() => onCloseSaveBankCardModal()}
        pb={isKeyboardVisible ? keyboardHeight : 0}
        justifyContent="flex-end"
        bottom="4"
        size="xl"
      >
        <Modal.Content>
          <Modal.CloseButton accessibilityRole="button" accessibilityLabel="Fechar modal" />
          <Modal.Header>Salvar cartão</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <FormControl isRequired isInvalid={formErrors.lastFourNumbers}>
                <HStack alignItems="center">
                  <FormControl.Label>Últimos 4 números</FormControl.Label>

                  <Popover trigger={InfoIconButton}>
                    <Popover.Content
                      accessibilityLabel="Números do cartão. Por razões de segurança, apenas mantemos os últimos 4 dígitos do cartão
                        armazenados."
                      w="56"
                    >
                      <Popover.Arrow />
                      <Popover.CloseButton
                        accessibilityRole="button"
                        accessibilityLabel="Fechar informação da caixa de texto"
                      />
                      <Popover.Header>Números do cartão</Popover.Header>
                      <Popover.Body>
                        Por razões de segurança, apenas mantemos os últimos 4 dígitos do cartão
                        armazenados.
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                </HStack>

                <Input
                  keyboardType="numeric"
                  onChangeText={(value) => setFormData({ ...formData, lastFourNumbers: value })}
                  value={formData.lastFourNumbers}
                  maxLength={4}
                  placeholder="Insira os últimos 4 números do seu cartão"
                />
                {'lastFourNumbers' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.lastFourNumbers}</FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.type}>
                <FormControl.Label>Tipo</FormControl.Label>
                <Select
                  _selectedItem={{
                    bg: 'primary.600',
                    endIcon: <CheckIcon size="5" color="white" />,
                  }}
                  selectedValue={formData.type}
                  accessibilityLabel="Selecione o tipo do seu cartão"
                  placeholder="Tipo do cartão"
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <Select.Item label="Crédito" value="credit" />
                  <Select.Item label="Débito" value="debit" />
                </Select>
                {'type' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.type}</FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.bankAccountId}>
                <FormControl.Label>Conta bancária</FormControl.Label>
                <Select
                  _selectedItem={{
                    bg: 'primary.600',
                    endIcon: <CheckIcon size="5" color="white" />,
                  }}
                  selectedValue={formData.bankAccountId}
                  accessibilityLabel="Selecione a conta bancária do cartão"
                  placeholder="Conta bancária do cartão"
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
                  <FormControl.ErrorMessage>{formErrors.bankAccountId}</FormControl.ErrorMessage>
                )}
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                saveBankCard();
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

export default BankCards;
