import React, { useContext, useState } from 'react';
import {
  useColorModeValue,
  Center,
  Text,
  Box,
  FlatList,
  VStack,
  Fab,
  Icon,
  Popover,
  Button,
  Image,
  Modal,
  FormControl,
  Input,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { DataContext } from '../contexts/DataContext';
import api from '../services/api';
import { ToastContext } from '../contexts/ToastContext';
import { AuthContext } from '../contexts/AuthContext';
import useKeyboard from '../hooks/useKeyboard';

const customTrigger = (triggerProps) => (
  <Button {...triggerProps} colorScheme="danger">
    Deletar
  </Button>
);

const BankAccounts = () => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');

  const { banks, bankAccounts, removeBankAccount } = useContext(DataContext);
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

  return (
    <Box flex="1" bg={bg}>
      <Center my="4">
        <Text>CONTAS</Text>
      </Center>

      {bankAccounts.length === 0 && (
        <Center h="100%">
          <Image w="100" h="100" source={require('../assets/images/empty.png')} alt="empty" />
          <Text mt="2">Nenhuma conta encontrada...</Text>
        </Center>
      )}

      <FlatList
        data={bankAccounts}
        renderItem={({ item }) => (
          <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor}>
            <VStack>
              <Text>ID: {item.id}</Text>
              <Text>NÚMERO: {item.number}</Text>
              <Text>DÍGITO: {item.digit}</Text>
              <Text>AGÊNCIA: {item.agency}</Text>
              <Text>BANCO: {item.bank.name}</Text>
            </VStack>

            <Box w="100%" alignItems="center">
              <Popover trigger={customTrigger}>
                <Popover.Content accessibilityLabel="Deletar conta" w="56">
                  <Popover.Arrow />
                  <Popover.CloseButton />
                  <Popover.Header>Deletar conta</Popover.Header>
                  <Popover.Body>
                    Isso removerá os dados relacionados a conta. Esta ação não pode ser revertida.
                    Os dados excluídos não podem ser recuperados.
                  </Popover.Body>
                  <Popover.Footer justifyContent="flex-end">
                    <Button.Group>
                      <Button
                        isLoading={isLoading}
                        onPress={() => deleteAccount(item.id)}
                        colorScheme="danger"
                      >
                        Deletar
                      </Button>
                    </Button.Group>
                  </Popover.Footer>
                </Popover.Content>
              </Popover>
            </Box>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />

      <Box position="relative" h={100} w="100%">
        <Fab
          onPress={() => {
            setSaveBankAccountModalVisible(true);
          }}
          mb={16}
          position="absolute"
          size="sm"
          icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        />
      </Box>

      <Modal
        isOpen={saveBankAccountModalVisible}
        onClose={() => setSaveBankAccountModalVisible(false)}
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
              <FormControl>
                <FormControl.Label>Número</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl>
                <FormControl.Label>Dígito</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl>
                <FormControl.Label>Agência</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl>
                <FormControl.Label>Banco</FormControl.Label>
                <Input />
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setSaveBankAccountModalVisible(false);
              }}
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
