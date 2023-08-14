import React, { useContext } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Icon, Text, Box, Heading, Image, Center } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';

const slides = [
  {
    key: 's1',
    title: 'Gerencie seus gastos!',
    text: 'SmartSpend te auxilia no controle e gestão das finanças',
    image: require('../../assets/images/slides/1.png'),
  },
  {
    key: 's2',
    title: 'Aprenda mais!',
    text: 'Estude com dicas sobre investimentos e economia',
    image: require('../../assets/images/slides/2.png'),
  },
  {
    key: 's3',
    title: 'Defina metas!',
    text: 'Economize com nosso sistema de meta de gastos',
    image: require('../../assets/images/slides/3.png'),
  },
];

const NextButton = () => (
  <Center bgColor="primary.600" borderRadius="full" w={10} h={10}>
    <Icon size="md" as={<Feather name="chevron-right" />} color="white" />
  </Center>
);

const DoneButton = () => (
  <Center bgColor="primary.600" borderRadius="full" w={10} h={10}>
    <Icon size="md" as={<Feather name="check" />} color="white" />
  </Center>
);

const Item = ({ item }) => (
  <Box flex={1} bg="warmGray.100" alignItems="center" justifyContent="space-around" pb={100}>
    <Heading size="lg" fontWeight="600">
      {item.title}
    </Heading>

    <Image w="200" h="200" source={item.image} alt={item.key} />

    <Text mx={20} textAlign="center">
      {item.text}
    </Text>
  </Box>
);

const Welcome = ({ navigation }) => {
  const { setAuthHasFirstAccess } = useContext(AuthContext);

  const onDone = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      })
    );
    setAuthHasFirstAccess(true);
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={Item}
      onDone={onDone}
      renderDoneButton={DoneButton}
      renderNextButton={NextButton}
      activeDotStyle={{
        backgroundColor: '#d97706',
      }}
    />
  );
};

export default Welcome;
