import React from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useColorModeValue, Box, Text, Icon, HStack, View } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import financeTips from '../utils/financeTips';

const { width } = Dimensions.get('window');

const interval = 5000;

const getRandomTips = () => {
  // eslint-disable-next-line no-plusplus
  for (let i = financeTips.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [financeTips[i], financeTips[j]] = [financeTips[j], financeTips[i]];
  }
  return financeTips;
};

const TipsCarousel = () => {
  const boxColor = useColorModeValue('white', 'dark.100');
  const tips = getRandomTips();

  return (
    <View>
      <Carousel
        data={tips}
        renderItem={({ item }) => (
          <Box shadow={2} mx={4} mb={4} mt={2} p={4} borderRadius={8} bg={boxColor}>
            <HStack mr="10" alignItems="center">
              <Icon
                size="md"
                color="primary.600"
                as={<MaterialCommunityIcons name="lightbulb-on-outline" />}
                mr={4}
              />
              <Text numberOfLines={2}>{item}</Text>
            </HStack>
          </Box>
        )}
        sliderWidth={width}
        itemWidth={width}
        loop
        autoplay
        autoplayInterval={interval}
        scrollEnabled={false}
      />
    </View>
  );
};

export default TipsCarousel;
