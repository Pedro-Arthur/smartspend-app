import React from 'react';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { processFontFamily } from 'expo-font';
import { Box, useColorModeValue } from 'native-base';

const SpendMethodsMostUsed = () => {
  const boxColor = useColorModeValue('white', 'dark.100');
  const boxColorHex = useColorModeValue('#ffffff', '#27272a');
  const labelColor = useColorModeValue('#000', '#fff');

  return (
    <Box
      accessible
      accessibilityLabel="Gráfico de métodos mais usados"
      shadow={2}
      mx={4}
      p={4}
      borderRadius={8}
      bg={boxColor}
      mt={2}
    >
      <PieChart
        data={[
          {
            name: 'Seoul',
            population: 21500000,
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'Toronto',
            population: 2800000,
            color: '#F00',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'New York',
            population: 8538000,
            color: '#ffffff',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'Moscow',
            population: 11920000,
            color: 'rgb(0, 0, 255)',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
        ]}
        width={Dimensions.get('window').width - 64}
        height={220}
        chartConfig={{
          backgroundColor: boxColorHex,
          backgroundGradientFrom: boxColorHex,
          backgroundGradientTo: boxColorHex,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </Box>
  );
};

export default SpendMethodsMostUsed;
