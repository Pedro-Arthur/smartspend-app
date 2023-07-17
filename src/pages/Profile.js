import React, { useContext, useState } from 'react';
import {
  useColorModeValue,
  Box,
  Text,
  useColorMode,
  Switch,
  Center,
  Menu,
  Pressable,
  Icon,
  HStack,
  Avatar,
  FormControl,
  Input,
  Button,
  Heading,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { ToastContext } from '../contexts/ToastContext';

const SettingsIcon = ({ triggerProps }) => (
  <Pressable accessibilityLabel="Menu de configurações" {...triggerProps}>
    <Icon as={<AntDesign name="setting" />} size="md" color="muted.400" />
  </Pressable>
);

const Profile = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const boxColor = useColorModeValue('white', 'coolGray.900');
  const { colorMode, toggleColorMode } = useColorMode();
  const settingsIcon = (triggerProps) => <SettingsIcon triggerProps={triggerProps} />;

  const { showToast } = useContext(ToastContext);
  const { user, token, removeAuthIsLoggedIn, removeAuthUser, removeAuthToken, setAuthUser } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user.name,
  });
  const [formErrors, setFormErrors] = useState({
    name: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUser = async () => {
    const errors = {
      name: null,
    };

    if (!formData.name) {
      errors.name = 'Nome é obrigatório!';
    }

    setFormErrors(errors);

    if (!errors.name) {
      try {
        setIsLoading(true);

        await api.patch(
          `/users/${user.id}`,
          { name: formData.name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showToast({
          title: 'Sucesso!',
          description: 'Usuário atualizado com sucesso!',
          variant: 'solid',
          isClosable: true,
          status: 'success',
        });

        await setAuthUser({ ...user, name: formData.name });
      } catch (error) {
        showToast({
          title: 'Ops!',
          description: error?.response?.data?.message || 'Erro ao atualizar usuário!',
          variant: 'solid',
          isClosable: true,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    await Promise.all([removeAuthIsLoggedIn(), removeAuthUser(), removeAuthToken()]);
  };

  return (
    <Box flex="1" bg={bg} safeArea>
      <Center my="4">
        <Text>PERFIL</Text>
      </Center>

      <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor}>
        <HStack justifyContent="flex-end">
          <Menu w="190" trigger={settingsIcon}>
            <Menu.Item>
              <HStack alignItems="center" space={4}>
                <Text>Tema escuro</Text>
                <Switch isChecked={colorMode === 'dark'} onToggle={toggleColorMode} />
              </HStack>
            </Menu.Item>
          </Menu>
        </HStack>

        <Center mt={4}>
          {user.pictureUrl ? (
            <Avatar
              size="70px"
              source={{
                uri: user.pictureUrl,
              }}
            />
          ) : (
            <Avatar size="70px" bg="primary.600" _text={{ color: 'white', fontSize: 'lg' }}>
              {user.name.charAt(0)}
            </Avatar>
          )}

          <Text fontWeight="medium" fontSize="lg" mt={3}>
            {user.name}
          </Text>
          <Text color="muted.400" fontSize="xs">
            {user.email}
          </Text>

          <Button bg="red.700" onPress={() => handleLogout()} mt="4" w="100%">
            Sair
          </Button>
        </Center>
      </Box>

      <Box shadow={2} mx={4} mt={4} p={4} borderRadius={8} bg={boxColor}>
        <Center mb={4}>
          <Heading fontWeight="medium" size="sm">
            SEUS DADOS
          </Heading>
        </Center>

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

        <Button isLoading={isLoading} onPress={() => handleUpdateUser()} mt="4">
          Salvar
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
