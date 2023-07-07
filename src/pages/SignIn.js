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
  Pressable,
} from 'native-base';
import { AntDesign, Feather } from '@expo/vector-icons';
import { ToastContext } from '../contexts/ToastContext';
import { FetchLoadingContext } from '../contexts/FetchLoadingContext';
import { AuthContext } from '../contexts/AuthContext';
import GoogleLogo from '../assets/images/google-logo.svg';

const SignIn = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { showToast } = useContext(ToastContext);
  const { setIsFetchLoading } = useContext(FetchLoadingContext);
  const { setAuthIsLoggedIn, setAuthUser, setAuthToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: null,
    password: null,
  });
  const [formErrors, setFormErrors] = useState({
    email: null,
    password: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const validate = async () => {
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

      await Promise.all([
        setAuthIsLoggedIn(true),
        setAuthToken('dehjhdgjhgde'),
        setAuthUser({ id: 1, name: 'Pedro' }),
      ]);
    }
  };

  useEffect(() => {
    setIsFetchLoading(true);
    setTimeout(() => {
      setIsFetchLoading(false);
    }, 2000);
  }, []);

  return (
    <Center bg={bg} flex={1} safeArea w="100%">
      <Box safeArea p="2" py="8" w="90%">
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
              InputLeftElement={
                <Icon as={<AntDesign name="mail" />} size={4} ml="3" color="muted.400" />
              }
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
              type={showPassword ? 'text' : 'password'}
              InputRightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    as={<Feather name={showPassword ? 'eye' : 'eye-off'} />}
                    size={4}
                    mr="3"
                    color="muted.400"
                  />
                </Pressable>
              }
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
              onPress={() => navigation.navigate('RecoverPassword')}
            >
              Esqueceu a senha?
            </Link>
          </FormControl>

          <Button onPress={validate} mt="2">
            Entrar
          </Button>

          <Button variant="outline" startIcon={<GoogleLogo width={20} height={20} />} mt="2">
            <Text>Entrar com Google</Text>
          </Button>

          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm">Não tem uma conta? </Text>
            <Link
              _text={{
                fontWeight: 'medium',
                fontSize: 'sm',
                color: 'primary.600',
              }}
              onPress={() => navigation.navigate('SignUp')}
            >
              Cadastre-se
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignIn;
