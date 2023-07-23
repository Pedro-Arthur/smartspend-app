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
  KeyboardAvoidingView,
} from 'native-base';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { ToastContext } from '../../contexts/ToastContext';
import api from '../../services/api';

const RecoverPasswordCheckCode = ({ navigation }) => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    code: null,
  });
  const [formErrors, setFormErrors] = useState({
    code: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRecoverPasswordCheckCode = async () => {
    const errors = {
      code: null,
    };

    if (!formData.code) {
      errors.code = 'Código é obrigatório!';
    }

    setFormErrors(errors);

    if (!errors.code) {
      try {
        setIsLoading(true);
        await api.get(`/auth/resetPassword/checkCode/${formData.code}`);
        navigation.navigate('RecoverPasswordUpdate', { code: formData.code });
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao verificar código!',
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
            Verificar código
          </Heading>

          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={formErrors.code}>
              <FormControl.Label>Código</FormControl.Label>
              <Input
                InputLeftElement={
                  <Icon as={<AntDesign name="lock" />} size={4} ml="3" color="muted.400" />
                }
                placeholder="******"
                onChangeText={(value) => setFormData({ ...formData, code: value })}
                value={formData.code}
              />
              {'code' in formErrors && (
                <FormControl.ErrorMessage>{formErrors.code}</FormControl.ErrorMessage>
              )}
            </FormControl>

            <Button isLoading={isLoading} onPress={handleRecoverPasswordCheckCode} mt="2">
              Verificar
            </Button>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </Center>
  );
};

export default RecoverPasswordCheckCode;
