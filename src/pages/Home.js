import React, { useContext } from 'react';
import {
  useColorModeValue,
  Heading,
  Center,
  Button,
  Switch,
  useColorMode,
  Text,
  HStack,
} from 'native-base';
import { AuthContext } from '../contexts/AuthContext';
import TermsModal from '../components/TermsModal';

const Home = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const { colorMode, toggleColorMode } = useColorMode();
  const { removeAuthIsLoggedIn, removeAuthUser, removeAuthToken } = useContext(AuthContext);

  const logout = async (force) => {
    if (force) {
      await Promise.all([removeAuthIsLoggedIn(), removeAuthUser(), removeAuthToken()]);
    } else {
      await removeAuthIsLoggedIn();
    }
  };

  return (
    <>
      <Center flex="1" bg={bg} safeArea>
        <Heading>HOME</Heading>

        <Text my={5}>Tema atual: {colorMode}</Text>

        <HStack flexShrink={1} alignItems="center">
          <Text>Modo escuro:</Text>
          <Switch isChecked={colorMode === 'dark'} onToggle={toggleColorMode} mt={5} size="lg" />
        </HStack>

        <Button mt={5} onPress={() => logout(true)} w={40} backgroundColor="red.500">
          force logout
        </Button>
        <Button mt={5} onPress={() => logout(false)} w={40} backgroundColor="red.500">
          simulate expiration
        </Button>
      </Center>

      <TermsModal />
    </>
  );
};

export default Home;
