import React, { useState } from 'react';
import { Button, Modal, Center, Box, useColorModeValue, Text } from 'native-base';
import { Animated, Pressable } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const TermsTab = () => (
  <Center flex={1} my="4">
    <Text>1</Text>
  </Center>
);

const PolicyTab = () => (
  <Center flex={1} my="4">
    <Text>2</Text>
  </Center>
);

const renderScene = SceneMap({
  first: TermsTab,
  second: PolicyTab,
});

const Tabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'first',
      title: 'Termos',
    },
    {
      key: 'second',
      title: 'Política',
    },
  ]);

  const textColor = useColorModeValue('#000', '#e5e5e5');
  const inactiveBorderColor = useColorModeValue('coolGray.200', 'gray.400');

  const getBorderColor = (i) => (index === i ? 'primary.600' : inactiveBorderColor);

  const renderTabBar = ({ navigationState }) => (
    <Box flexDirection="row">
      {navigationState.routes.map((route, i) => (
        <Box
          key={route.key}
          borderBottomWidth="3"
          borderColor={getBorderColor(i)}
          flex={1}
          alignItems="center"
          p="3"
          cursor="pointer"
        >
          <Pressable
            onPress={() => {
              setIndex(i);
            }}
          >
            <Animated.Text
              style={{
                color: textColor,
              }}
            >
              {route.title}
            </Animated.Text>
          </Pressable>
        </Box>
      ))}
    </Box>
  );

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
    />
  );
};

const TermsModal = () => {
  const [modalTermsVisible, setModalTermsVisible] = useState(true);

  const acceptTerms = () => {
    setModalTermsVisible(false);
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={modalTermsVisible}
      onClose={setModalTermsVisible}
      size="xl"
    >
      <Modal.Content>
        <Modal.Header>Nossos termos</Modal.Header>

        <Modal.Body>
          <Tabs />
        </Modal.Body>

        <Modal.Footer>
          <Button.Group>
            <Button onPress={() => acceptTerms()}>Aceitar</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default TermsModal;
