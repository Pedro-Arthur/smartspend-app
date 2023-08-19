import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useColorModeValue, Box, Text } from 'native-base';
import financeTips from '../utils/financeTips';

const { width } = Dimensions.get('window');

const interval = 5000;

const getRandomTips = () => {
  const shuffledTips = financeTips.slice();

  // eslint-disable-next-line no-plusplus
  for (let i = shuffledTips.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTips[i], shuffledTips[j]] = [shuffledTips[j], shuffledTips[i]];
  }

  return shuffledTips.slice(0, 3);
};

const TipsCarousel = () => {
  const boxColor = useColorModeValue('white', 'dark.100');
  const [tips, setTips] = useState(getRandomTips());

  return (
    <Carousel
      data={tips}
      renderItem={({ item }) => (
        <Box shadow={2} m={4} p={4} borderRadius={8} bg={boxColor}>
          <Text>{item}</Text>
        </Box>
      )}
      sliderWidth={width}
      itemWidth={width}
      loop
      autoplay
      autoplayInterval={interval}
      scrollEnabled={false}
      onScrollIndexChanged={(index) => {
        if (index === 0) {
          setTips(getRandomTips());
        }
      }}
    />
  );
};

export default TipsCarousel;
