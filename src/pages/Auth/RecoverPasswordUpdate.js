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
  IconButton,
  Icon,
  Pressable,
  KeyboardAvoidingView,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { AccessibilityInfo, Platform } from 'react-native';
import { ToastContext } from '../../contexts/ToastContext';
import api from '../../services/api';

const RecoverPasswordUpdate = ({ navigation, route }) => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    newPassword: null,
    confirmPassword: null,
  });
  const [formErrors, setFormErrors] = useState({
    newPassword: null,
    confirmPassword: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecoverPasswordUpdate = async () => {
    const errors = {
      newPassword: null,
      confirmPassword: null,
    };

    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!formData.newPassword) {
      errors.newPassword = 'Senha é obrigatória!';
      AccessibilityInfo.announceForAccessibility('Senha é obrigatória!');
    } else if (formData.newPassword.length < 8 || !regexPass.test(formData.newPassword)) {
      errors.newPassword =
        'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial. Além disso, a senha deve ter no mínimo 8 caracteres de comprimento.';
      AccessibilityInfo.announceForAccessibility(
        'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial. Além disso, a senha deve ter no mínimo 8 caracteres de comprimento.'
      );
    } else if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPassword = 'Senhas não coincidem!';
      AccessibilityInfo.announceForAccessibility('Senhas não coincidem!');
    }

    setFormErrors(errors);

    if (!errors.newPassword && !errors.confirmPassword) {
      try {
        setIsLoading(true);
        await api.patch(
          `/auth/resetPassword/updatePassword/${route?.params?.code || '-'}`,
          formData
        );

        showToast({
          title: 'Sucesso!',
          description: 'Senha alterada com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          })
        );
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao alterar senha!',
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} w="90%">
        <Box p="2" py="8">
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
            Alterar senha
          </Heading>

          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={formErrors.newPassword}>
              <FormControl.Label>Nova senha</FormControl.Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                InputRightElement={
                  <Pressable
                    accessibilityLabel="Alterar visibilidade da senha"
                    accessibilityRole="button"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      as={<Feather name={showPassword ? 'eye' : 'eye-off'} />}
                      size={4}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
                placeholder="Insira a nova senha"
                onChangeText={(value) => setFormData({ ...formData, newPassword: value })}
                value={formData.newPassword}
              />
              {'newPassword' in formErrors && (
                <FormControl.ErrorMessage>{formErrors.newPassword}</FormControl.ErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={formErrors.confirmPassword}>
              <FormControl.Label>Confirme a nova senha</FormControl.Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                InputRightElement={
                  <Pressable
                    accessibilityLabel="Alterar visibilidade da confirmação da senha"
                    accessibilityRole="button"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      as={<Feather name={showPassword ? 'eye' : 'eye-off'} />}
                      size={4}
                      mr="3"
                      color="muted.400"
                    />
                  </Pressable>
                }
                placeholder="Insira a confirmação da senha"
                onChangeText={(value) => setFormData({ ...formData, confirmPassword: value })}
                value={formData.confirmPassword}
              />
              {'confirmPassword' in formErrors && (
                <FormControl.ErrorMessage>{formErrors.confirmPassword}</FormControl.ErrorMessage>
              )}
            </FormControl>

            <Button isLoading={isLoading} onPress={handleRecoverPasswordUpdate} mt="2">
              Salvar
            </Button>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </Center>
  );
};

export default RecoverPasswordUpdate;
