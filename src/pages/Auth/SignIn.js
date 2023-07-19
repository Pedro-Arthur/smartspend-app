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
  IconButton,
} from 'native-base';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastContext } from '../../contexts/ToastContext';
import { AuthContext } from '../../contexts/AuthContext';
import { FetchLoadingContext } from '../../contexts/FetchLoadingContext';
import GoogleLogo from '../../assets/images/google-logo.svg';
import api from '../../services/api';
import UserAvatarBox from '../../components/UserAvatarBox';

WebBrowser.maybeCompleteAuthSession();

const SignIn = ({ navigation }) => {
  // eslint-disable-next-line no-unused-vars
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    expoClientId: GOOGLE_WEB_CLIENT_ID,
  });

  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

  const { showToast } = useContext(ToastContext);
  const { setAuthIsLoggedIn, setAuthUser, setAuthToken, token, user } = useContext(AuthContext);
  const { setIsFetchLoading } = useContext(FetchLoadingContext);

  const [formData, setFormData] = useState({
    email: null,
    password: null,
  });
  const [formErrors, setFormErrors] = useState({
    email: null,
    password: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isAvailableBiometricAuthenticate, setIsAvailableBiometricAuthenticate] = useState(false);
  const [loginHeader, setLoginHeader] = useState('email');

  const handleSignIn = async () => {
    const errors = {
      email: null,
      password: null,
    };

    if (loginHeader === 'email') {
      if (!formData.email) {
        errors.email = 'E-mail é obrigatório!';
      } else {
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!regexEmail.test(formData.email)) {
          errors.email = 'E-mail é inválido!';
        }
      }
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatório!';
    }

    setFormErrors(errors);

    if (!errors.email && !errors.password) {
      try {
        setIsLoading(true);

        const res = await api.post('/auth/login', {
          email: loginHeader === 'email' ? formData.email : user.email,
          password: formData.password,
        });

        const authUser = await api.get('/auth/user', {
          headers: {
            Authorization: `Bearer ${res.token}`,
          },
        });

        showToast({
          title: 'Sucesso!',
          description: 'Usuário autenticado com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        await Promise.all([
          setAuthIsLoggedIn(true),
          setAuthToken(res.token),
          setAuthUser(authUser),
        ]);
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao logar usuário!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignInWithGoogle = async () => {
    if (response?.type === 'success') {
      try {
        setIsLoadingGoogle(true);

        const res = await api.post('/auth/loginWithGoogle', {
          token: response.authentication.accessToken,
        });

        const authUser = await api.get('/auth/user', {
          headers: {
            Authorization: `Bearer ${res.token}`,
          },
        });

        showToast({
          title: 'Sucesso!',
          description: 'Usuário autenticado com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        await Promise.all([
          setAuthIsLoggedIn(true),
          setAuthToken(res.token),
          setAuthUser(authUser),
        ]);
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao logar usuário com Google!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoadingGoogle(false);
      }
    }
  };

  const handleBiometricAuthenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticação',
      cancelLabel: 'Senha',
      disableDeviceFallback: true,
    });

    if (result.success) {
      try {
        setIsFetchLoading(true);
        const res = await api.post('/auth/loginByToken', {
          token,
        });

        const authUser = await api.get('/auth/user', {
          headers: {
            Authorization: `Bearer ${res.token}`,
          },
        });

        showToast({
          title: 'Sucesso!',
          description: 'Usuário autenticado com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        await Promise.all([
          setAuthIsLoggedIn(true),
          setAuthToken(res.token),
          setAuthUser(authUser),
        ]);
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao logar usuário com biometria!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsFetchLoading(false);
      }
    }
  };

  const handleIsAvailableBiometricAuthenticate = async () => {
    if (await AsyncStorage.getItem('@token')) {
      const available = await LocalAuthentication.hasHardwareAsync();
      const enroll = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (
        available &&
        enroll &&
        supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      ) {
        setIsAvailableBiometricAuthenticate(true);
        await handleBiometricAuthenticate();
      }
    }
  };

  const handleLoginHeader = async () => {
    setIsFetchLoading(true);
    if (await AsyncStorage.getItem('@user')) {
      setLoginHeader('user-avatar-box');
    }
    setIsFetchLoading(false);
  };

  const toggleLoginHeader = () => {
    if (loginHeader === 'email') setLoginHeader('user-avatar-box');
    else setLoginHeader('email');
  };

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  useEffect(() => {
    handleIsAvailableBiometricAuthenticate();
    handleLoginHeader();
  }, []);

  return (
    <Center bg={bg} flex={1} w="100%">
      <Box p="2" py="8" w="90%">
        <Heading size="lg" fontWeight="600">
          Bem-vindo
        </Heading>
        <Heading mt="1" fontWeight="medium" size="xs">
          Faça login para continuar!
        </Heading>

        <VStack space={3} mt="5">
          {loginHeader === 'email' && (
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
          )}

          {loginHeader !== 'email' && (
            <UserAvatarBox user={user} changeLoginHeader={() => toggleLoginHeader()} />
          )}

          <FormControl isRequired isInvalid={formErrors.password}>
            <FormControl.Label>Senha</FormControl.Label>
            <Input
              placeholder="******"
              onChangeText={(value) => setFormData({ ...formData, password: value })}
              value={formData.password}
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
              onPress={() => navigation.navigate('RecoverPasswordSendCode')}
            >
              Esqueceu a senha?
            </Link>
          </FormControl>

          <Button isLoading={isLoading} onPress={handleSignIn} mt="2">
            Entrar
          </Button>

          <Button
            isLoading={isLoadingGoogle}
            onPress={() => promptAsync()}
            variant="outline"
            startIcon={<GoogleLogo width={20} height={20} />}
            mt="2"
          >
            <Text>Entrar com Google</Text>
          </Button>

          {token && isAvailableBiometricAuthenticate && (
            <Box alignItems="center">
              <IconButton
                borderRadius="full"
                mt="3"
                _icon={{
                  as: Ionicons,
                  name: 'finger-print-sharp',
                  size: 31,
                  color: 'primary.600',
                }}
                onPress={handleBiometricAuthenticate}
              />
            </Box>
          )}

          <HStack mt="3" justifyContent="center">
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
