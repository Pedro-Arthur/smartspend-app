import React, { useEffect } from 'react';
import { Box, Button, Text, useColorMode, useColorModeValue, useToast } from 'native-base';
import * as NetInfo from '@react-native-community/netinfo';
import ToastAlert from '../components/ToastAlert';

const SignIn = () => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('Light', 'Dark');
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');
  const toast = useToast();

  useEffect(() => {
    const checkInternetConnection = async () => {
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        toast.show({
          render: ({ id }) => (
            <ToastAlert
              id={id}
              toast={toast}
              title="Sem conexão com a internet"
              description="Verifique sua conexão e tente novamente."
              variant="solid"
              isClosable
            />
          ),
        });
      }
    };

    checkInternetConnection();
  }, []);

  return (
    <Box flex="1" bg={bg} safeArea>
      <Text fontSize="lg" display="flex" mb={20}>
        The active color mode is{' '}
        <Text bold fontSize="18px">
          {text}
        </Text>
      </Text>
      <Button onPress={toggleColorMode} h={10}>
        Toggle
      </Button>
    </Box>
  );
};

export default SignIn;
