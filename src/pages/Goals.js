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
  HStack,
  Divider,
  FormControl,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { DataContext } from '../contexts/DataContext';
import api from '../services/api';
import { ToastContext } from '../contexts/ToastContext';
import { AuthContext } from '../contexts/AuthContext';
import useKeyboard from '../hooks/useKeyboard';
import { formatDate } from '../utils/helpers';
import CurrencyInput from '../components/CurrencyInput';
import DatePickerInput from '../components/DatePickerInput';

const DeleteButton = (triggerProps) => (
  <Button {...triggerProps} colorScheme="danger">
    Deletar
  </Button>
);

const Goals = () => {
  const todayDate = formatDate(new Date(), 'YYYY-MM-DD');
  const maximumDate = formatDate(new Date(2030, 0, 1), 'YYYY-MM-DD');

  const { isKeyboardVisible, keyboardHeight } = useKeyboard();

  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');
  const customCardText = useColorModeValue('black', 'white');

  const { goals, removeGoal, addGoal, updateGoal } = useContext(DataContext);
  const { showToast } = useContext(ToastContext);
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    maxValue: 0,
  });
  const [formErrors, setFormErrors] = useState({
    startDate: null,
    endDate: null,
    maxValue: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveGoalModalVisible, setSaveGoalModalVisible] = useState(false);

  const onCloseSaveGoalModal = () => {
    setSaveGoalModalVisible(false);
    setFormData({
      startDate: null,
      endDate: null,
      maxValue: 0,
    });
    setFormErrors({
      startDate: null,
      endDate: null,
      maxValue: null,
    });
  };

  const saveGoal = async () => {
    const errors = {
      startDate: null,
      endDate: null,
      maxValue: null,
    };

    if (!formData.startDate) {
      errors.startDate = 'A data inicial é obrigatória!';
    }

    if (!formData.endDate) {
      errors.endDate = 'A data final é obrigatória!';
    }

    if (!formData.maxValue) {
      errors.maxValue = 'O valor é obrigatório!';
    }

    setFormErrors(errors);

    if (!errors.startDate && !errors.endDate && !errors.maxValue) {
      try {
        setIsLoading(true);

        const customFormData = {
          ...formData,
          startDate: formatDate(formData.startDate, 'YYYY-MM-DD'),
          endDate: formatDate(formData.endDate, 'YYYY-MM-DD'),
        };

        if (!formData.id) {
          const goal = await api.post('/goals', customFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          addGoal(goal);
        } else {
          const goal = await api.patch(`/goals/${formData.id}`, customFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          updateGoal(formData.id, goal);
        }

        showToast({
          title: 'Sucesso!',
          description: 'Meta salva com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        onCloseSaveGoalModal();
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao salvar meta!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteGoal = async (id) => {
    try {
      setIsLoading(true);

      await api.delete(`/goals/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      removeGoal(id);

      showToast({
        title: 'Sucesso!',
        description: 'Meta deletada com sucesso!',
        variant: 'solid',
        isClosable: true,
        status: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Ops!',
        description: error?.response?.data?.message || 'Erro ao deletar meta!',
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
        <Text>METAS</Text>
      </Center>

      {goals.length === 0 && (
        <Center position="absolute" alignSelf="center" h="100%">
          <Image w="100" h="100" source={require('../assets/images/empty.png')} alt="empty" />
          <Text mt="2">Nenhuma meta encontrada...</Text>
        </Center>
      )}

      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor} mb={4}>
            <VStack>
              <Text fontWeight="semibold" fontSize="md" color="primary.600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(item.maxValue)}
              </Text>

              <Divider my={4} />

              <HStack justifyContent="space-between">
                <Text fontSize="xs" color="muted.400">
                  Início:{' '}
                  <Text fontWeight="semibold" color={customCardText}>
                    {formatDate(item.startDate, 'DD/MM/YYYY')}
                  </Text>
                </Text>

                <Text fontSize="xs" color="muted.400">
                  Fim:{' '}
                  <Text fontWeight="semibold" color={customCardText}>
                    {formatDate(item.endDate, 'DD/MM/YYYY')}
                  </Text>
                </Text>
              </HStack>
            </VStack>

            <Divider my={4} />

            <HStack justifyContent="space-between" alignItems="center">
              <Button
                colorScheme="primary"
                onPress={() => {
                  setFormData(item);
                  setSaveGoalModalVisible(true);
                }}
                width="48%"
              >
                Editar
              </Button>

              <Box width="48%">
                <Popover trigger={DeleteButton}>
                  <Popover.Content accessibilityLabel="Deletar conta" w="56">
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header>Deletar meta</Popover.Header>
                    <Popover.Body>
                      Isso removerá os dados relacionados a meta. Esta ação não pode ser revertida.
                      Os dados excluídos não podem ser recuperados.
                    </Popover.Body>
                    <Popover.Footer justifyContent="flex-end">
                      <Button.Group>
                        <Button
                          isLoading={isLoading}
                          onPress={() => deleteGoal(item.id)}
                          colorScheme="danger"
                        >
                          Deletar
                        </Button>
                      </Button.Group>
                    </Popover.Footer>
                  </Popover.Content>
                </Popover>
              </Box>
            </HStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />

      <Fab
        onPress={() => {
          setSaveGoalModalVisible(true);
        }}
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        renderInPortal={false}
      />

      <Modal
        isOpen={saveGoalModalVisible}
        onClose={() => onCloseSaveGoalModal()}
        pb={isKeyboardVisible ? keyboardHeight : 0}
        justifyContent="flex-end"
        bottom="4"
        size="xl"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Salvar meta</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <FormControl isRequired isInvalid={formErrors.startDate}>
                <FormControl.Label>Data inicial</FormControl.Label>
                <DatePickerInput
                  onChange={(value) => setFormData({ ...formData, startDate: value })}
                  value={formData.startDate}
                  maximumDate={maximumDate}
                  minimumDate={todayDate}
                  placeholder="Data inicial"
                />
                {'startDate' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.startDate}</FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.endDate}>
                <FormControl.Label>Data final</FormControl.Label>
                <DatePickerInput
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                  value={formData.endDate}
                  maximumDate={maximumDate}
                  minimumDate={todayDate}
                  placeholder="Data final"
                />
                {'endDate' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.endDate}</FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.maxValue}>
                <FormControl.Label>Valor máximo</FormControl.Label>
                <CurrencyInput
                  onChangeText={(value) => setFormData({ ...formData, maxValue: value })}
                  value={formData.maxValue}
                  maxDigits={9}
                />
                {'maxValue' in formErrors && (
                  <FormControl.ErrorMessage>{formErrors.maxValue}</FormControl.ErrorMessage>
                )}
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                saveGoal();
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

export default Goals;
