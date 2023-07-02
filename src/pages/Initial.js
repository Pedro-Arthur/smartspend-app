import React, { useEffect } from 'react';
import { useColorModeValue, useToast, Spinner, Center } from 'native-base';
import * as NetInfo from '@react-native-community/netinfo';
import ToastAlert from '../components/ToastAlert';

const Initial = ({ navigation }) => {
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
              status="error"
            />
          ),
        });
        return;
      }

      navigation.navigate('SignIn');
    };

    checkInternetConnection();
  }, []);

  return (
    <Center flex="1" bg={bg} safeArea>
      <Spinner size="lg" />
    </Center>
  );
};

export default Initial;
