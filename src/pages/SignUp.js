import React, { useState, useContext } from 'react';
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
import { ScrollView } from 'react-native';
import { ToastContext } from '../contexts/ToastContext';
import GoogleLogo from '../assets/images/google-logo.svg';

const SignUp = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { showToast } = useContext(ToastContext);

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

  const validate = () => {
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
      showToast({
        title: 'Sucesso!',
        description: 'Cadastrado com sucesso.',
        variant: 'solid',
        isClosable: true,
        status: 'success',
      });
    }
  };

  return (
    <ScrollView>
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
              />
              {'confirmPassword' in formErrors && (
                <FormControl.ErrorMessage>{formErrors.confirmPassword}</FormControl.ErrorMessage>
              )}
            </FormControl>

            <Button onPress={validate} mt="2">
              Cadastrar
            </Button>

            <Button variant="outline" startIcon={<GoogleLogo width={20} height={20} />} mt="2">
              <Text>Cadastrar com Google</Text>
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default SignUp;
