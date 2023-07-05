import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  useColorModeValue,
  Center,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  HStack,
  Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ToastContext } from '../contexts/ToastContext';
import { FetchLoadingContext } from '../contexts/FetchLoadingContext';

const SignIn = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { showToast } = useContext(ToastContext);
  const { setFetchLoading } = useContext(FetchLoadingContext);

  const [formData, setFormData] = useState({
    email: null,
    password: null,
  });
  const [formErrors, setFormErrors] = useState({
    email: null,
    password: null,
  });

  const validate = () => {
    const errors = {
      email: null,
      password: null,
    };

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório!';
    } else {
      const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!regexEmail.test(formData.email)) {
        errors.email = 'E-mail é inválido!';
      }
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatório!';
    }

    setFormErrors(errors);

    if (!errors.email && !errors.password) {
      showToast({
        title: 'Sucesso!',
        description: 'Autenticado com sucesso.',
        variant: 'solid',
        isClosable: true,
        status: 'success',
      });
    }
  };

  useEffect(() => {
    setFetchLoading(true);
    setTimeout(() => {
      setFetchLoading(false);
    }, 2000);
  }, []);

  return (
    <Center bg={bg} flex={1} safeArea w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600">
          Bem-vindo
        </Heading>
        <Heading mt="1" fontWeight="medium" size="xs">
          Faça login para continuar!
        </Heading>

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

          <FormControl isRequired isInvalid={formErrors.password}>
            <FormControl.Label>Senha</FormControl.Label>
            <Input
              placeholder="******"
              onChangeText={(value) => setFormData({ ...formData, password: value })}
              type="password"
            />
            {'password' in formErrors && (
              <FormControl.ErrorMessage>{formErrors.password}</FormControl.ErrorMessage>
            )}

            <Link
              _text={{
                fontSize: 'xs',
                fontWeight: '500',
                color: 'primary.600',
              }}
              alignSelf="flex-end"
              mt="1"
            >
              Esqueceu a senha?
            </Link>
          </FormControl>

          <Button onPress={validate} mt="2">
            Entrar
          </Button>

          <Button
            variant="solid"
            backgroundColor="red.900"
            endIcon={<Icon as={Ionicons} name="logo-google" size="sm" />}
            mt="2"
          >
            Entrar com
          </Button>

          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm">Não tem uma conta? </Text>
            <Link
              _text={{
                fontWeight: 'medium',
                fontSize: 'sm',
                color: 'primary.600',
              }}
            >
              Inscrever-se
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignIn;
