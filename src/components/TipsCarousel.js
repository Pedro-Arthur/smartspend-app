import React from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useColorModeValue, Box, Text } from 'native-base';

const { width } = Dimensions.get('window');

const cards = [
  { id: 1, text: 'Card 1' },
  { id: 2, text: 'Card 2' },
  { id: 3, text: 'Card 3' },
];

const interval = 3000;

const TipsCarousel = () => {
  const boxColor = useColorModeValue('white', 'dark.100');

  return (
    <Carousel
      data={cards}
      renderItem={({ item }) => (
        <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor}>
          <Text>{item.text}</Text>
        </Box>
      )}
      sliderWidth={width}
      itemWidth={width}
      loop
      autoplay
      autoplayInterval={interval}
      scrollEnabled={false}
    />
  );
};

export default TipsCarousel;
