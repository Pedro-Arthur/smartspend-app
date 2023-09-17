import React, { useState, useContext } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import {
  Box,
  Button,
  useColorModeValue,
  Center,
  Heading,
  VStack,
  FormControl,
  Input,
  Alert,
  Text,
  IconButton,
  Icon,
  KeyboardAvoidingView,
} from 'native-base';
import { Feather, AntDesign } from '@expo/vector-icons';
import { ToastContext } from '../../contexts/ToastContext';
import api from '../../services/api';

const RecoverPasswordSendCode = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    email: null,
  });
  const [formErrors, setFormErrors] = useState({
    email: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRecoverPasswordSendCode = async () => {
    const errors = {
      email: null,
    };

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório!';
      AccessibilityInfo.announceForAccessibility('E-mail é obrigatório!');
    } else {
      const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!regexEmail.test(formData.email)) {
        errors.email = 'E-mail é inválido!';
        AccessibilityInfo.announceForAccessibility('E-mail é inválido!');
      }
    }

    setFormErrors(errors);

    if (!errors.email) {
      try {
        setIsLoading(true);
        await api.post('/auth/resetPassword/sendCode', formData);

        showToast({
          title: 'Sucesso!',
          description: 'Um e-mail foi enviado contendo um código para criar uma nova senha.',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        navigation.navigate('RecoverPasswordCheckCode');
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao enviar código!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Center bg={bg} flex={1} w="100%">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Box p="2" py="8" w="90%">
          <IconButton
            accessibilityRole="button"
            accessibilityLabel="Botão de voltar para a página anterior"
            variant="unstyled"
            _icon={{
              as: Feather,
              name: 'chevron-left',
              size: 'lg',
              color: useColorModeValue('black', 'white'),
            }}
            onPress={() => navigation.goBack()}
            width="0"
          />
          <Heading size="lg" fontWeight="600">
            Recuperar senha
          </Heading>

          <Alert mt="5" w="100%" variant={useColorModeValue('subtle', 'solid')} status="warning">
            <VStack space={1} flexShrink={1} w="100%" alignItems="center">
              <Alert.Icon size="md" />
              <Text fontSize="md" fontWeight="medium">
                Atenção!
              </Text>

              <Box
                _text={{
                  textAlign: 'center',
                }}
              >
                Certifique-se de inserir o endereço de e-mail correto, pois enviaremos um e-mail com
                um código para alterar sua senha.
              </Box>
            </VStack>
          </Alert>

          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={formErrors.email}>
              <FormControl.Label>E-mail</FormControl.Label>
              <Input
                InputLeftElement={
                  <Icon as={<AntDesign name="mail" />} size={4} ml="3" color="muted.400" />
                }
                keyboardType="email-address"
                placeholder="Insira seu e-mail"
                onChangeText={(value) => setFormData({ ...formData, email: value })}
                value={formData.email}
              />
              {'email' in formErrors && (
                <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
              )}
            </FormControl>

            <Button isLoading={isLoading} onPress={handleRecoverPasswordSendCode} mt="2">
              Enviar
            </Button>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </Center>
  );
};

export default RecoverPasswordSendCode;
