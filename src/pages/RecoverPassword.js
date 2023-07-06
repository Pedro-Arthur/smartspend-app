import React, { useState, useContext } from 'react';
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
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import { ToastContext } from '../contexts/ToastContext';

const RecoverPassword = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    email: null,
  });
  const [formErrors, setFormErrors] = useState({
    email: null,
  });

  const validate = () => {
    const errors = {
      email: null,
    };

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório!';
    } else {
      const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!regexEmail.test(formData.email)) {
        errors.email = 'E-mail é inválido!';
      }
    }

    setFormErrors(errors);

    if (!errors.email && !errors.password) {
      showToast({
        title: 'Sucesso!',
        description: 'Um e-mail foi enviado contendo instruções para criar uma nova senha.',
        variant: 'solid',
        isClosable: true,
        status: 'success',
      });
    }
  };

  return (
    <Center bg={bg} flex={1} safeArea w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <IconButton
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

        <Alert mt="5" w="100%" status="warning">
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
              instruções sobre como alterar sua senha.
            </Box>
          </VStack>
        </Alert>

        <VStack space={3} mt="5">
          <FormControl isRequired isInvalid={formErrors.email}>
            <FormControl.Label>E-mail</FormControl.Label>
            <Input
              keyboardType="email-address"
              placeholder="joao@email.com"
              onChangeText={(value) => setFormData({ ...formData, email: value })}
            />
            {'email' in formErrors && (
              <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
            )}
          </FormControl>

          <Button onPress={validate} mt="2">
            Enviar
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default RecoverPassword;
