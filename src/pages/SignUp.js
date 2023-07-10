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
  IconButton,
  Icon,
  Pressable,
} from 'native-base';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env';
import { ToastContext } from '../contexts/ToastContext';
import { FetchLoadingContext } from '../contexts/FetchLoadingContext';
import GoogleLogo from '../assets/images/google-logo.svg';
import api from '../services/api';

WebBrowser.maybeCompleteAuthSession();

const SignUp = ({ navigation }) => {
  // eslint-disable-next-line no-unused-vars
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    expoClientId: GOOGLE_WEB_CLIENT_ID,
  });

  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const sucessMessage =
    'Cadastro do usuário realizado com sucesso. Por favor, verifique sua caixa de entrada de e-mails para concluir a confirmação.';
  const { showToast } = useContext(ToastContext);
  const { setIsFetchLoading } = useContext(FetchLoadingContext);

  const [formData, setFormData] = useState({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
  });
  const [formErrors, setFormErrors] = useState({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    const errors = { name: null, email: null, password: null, confirmPassword: null };

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório!';
    } else {
      const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!regexEmail.test(formData.email)) {
        errors.email = 'E-mail é inválido!';
      }
    }

    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!formData.password) {
      errors.password = 'Senha é obrigatório!';
    } else if (formData.password.length < 8 || !regexPass.test(formData.password)) {
      errors.password =
        'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial. Além disso, a senha deve ter no mínimo 8 caracteres de comprimento.';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Senhas não coincidem!';
    }

    if (!formData.name) {
      errors.name = 'Nome é obrigatório!';
    }

    setFormErrors(errors);

    if (!errors.email && !errors.password && !errors.name && !errors.confirmPassword) {
      try {
        setIsFetchLoading(true);
        await api.post('/users', formData);

        showToast({
          title: 'Sucesso!',
          description: sucessMessage,
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        setFormData({
          name: null,
          email: null,
          password: null,
          confirmPassword: null,
        });
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao cadastrar usuário!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsFetchLoading(false);
      }
    }
  };

  const handleSignUpWithGoogle = async () => {
    if (response?.type === 'success') {
      try {
        setIsFetchLoading(true);
        await api.post('/users/withGoogle', {
          token: response.authentication.accessToken,
        });

        showToast({
          title: 'Sucesso!',
          description: sucessMessage,
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao cadastrar usuário com Google!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsFetchLoading(false);
      }
    }
  };

  useEffect(() => {
    handleSignUpWithGoogle();
  }, [response]);

  return (
    <Center bg={bg} flex={1} safeArea w="100%">
      <Box safeArea p="2" py="8" w="90%">
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
          Bem-vindo
        </Heading>
        <Heading mt="1" fontWeight="medium" size="xs">
          Faça seu cadastro agora!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isRequired isInvalid={formErrors.name}>
            <FormControl.Label>Nome</FormControl.Label>
            <Input
              InputLeftElement={
                <Icon as={<AntDesign name="user" />} size={4} ml="3" color="muted.400" />
              }
              placeholder="João Silva"
              onChangeText={(value) => setFormData({ ...formData, name: value })}
              value={formData.name}
            />
            {'name' in formErrors && (
              <FormControl.ErrorMessage>{formErrors.name}</FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={formErrors.email}>
            <FormControl.Label>E-mail</FormControl.Label>
            <Input
              InputLeftElement={
                <Icon as={<AntDesign name="mail" />} size={4} ml="3" color="muted.400" />
              }
              keyboardType="email-address"
              placeholder="joao@email.com"
              onChangeText={(value) => setFormData({ ...formData, email: value })}
              value={formData.email}
            />
            {'email' in formErrors && (
              <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={formErrors.password}>
            <FormControl.Label>Senha</FormControl.Label>
            <Input
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
              placeholder="******"
              onChangeText={(value) => setFormData({ ...formData, password: value })}
              value={formData.password}
            />
            {'password' in formErrors && (
              <FormControl.ErrorMessage>{formErrors.password}</FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={formErrors.confirmPassword}>
            <FormControl.Label>Confirme a senha</FormControl.Label>
            <Input
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
              placeholder="******"
              onChangeText={(value) => setFormData({ ...formData, confirmPassword: value })}
              value={formData.confirmPassword}
            />
            {'confirmPassword' in formErrors && (
              <FormControl.ErrorMessage>{formErrors.confirmPassword}</FormControl.ErrorMessage>
            )}
          </FormControl>

          <Button onPress={handleSignUp} mt="2">
            Cadastrar
          </Button>

          <Button
            onPress={() => promptAsync()}
            variant="outline"
            startIcon={<GoogleLogo width={20} height={20} />}
            mt="2"
          >
            <Text>Cadastrar com Google</Text>
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignUp;
