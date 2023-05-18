import React from 'react';
import { NativeBaseProvider, extendTheme, WarningOutlineIcon, Button, Text } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

const theme = extendTheme({
  colors: {
    primary: {
      500: '#FF0000',
    },
  },
});

const App = () => (
  <NativeBaseProvider theme={theme}>
    <SafeAreaView>
      <WarningOutlineIcon />

      <Button size="sm" variant="subtle">
        PRIMARY
      </Button>
      <Button size="sm" variant="subtle" colorScheme="secondary">
        SECONDARY
      </Button>
      <Button size="sm" variant="subtle" isDisabled>
        DISABLED
      </Button>

      <Text fontSize="xs">xs</Text>
      <Text fontSize="sm">sm</Text>
      <Text fontSize="md">md</Text>
      <Text fontSize="lg">lg</Text>
      <Text fontSize="xl">xl</Text>
      <Text fontSize="2xl">2xl</Text>
      <Text fontSize="3xl">3xl</Text>
      <Text fontSize="4xl">4xl</Text>
      <Text fontSize="5xl">5xl</Text>
      <Text fontSize="6xl">6xl</Text>
    </SafeAreaView>
  </NativeBaseProvider>
);

export default App;
