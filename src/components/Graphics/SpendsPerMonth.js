import React from 'react';
import { Box, useColorModeValue } from 'native-base';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { processFontFamily } from 'expo-font';

const GraphicSpendsPerMonth1 = ({ data, scale }) => {
  const boxColor = useColorModeValue('white', 'dark.100');
  const boxColorHex = useColorModeValue('#ffffff', '#27272a');
  const graphicLabelColor = useColorModeValue('0, 0, 0', '255, 255, 255');

  return (
    <Box
      accessible
      accessibilityLabel="Gráfico de Gastos por mês"
      shadow={2}
      mx={4}
      p={4}
      borderRadius={8}
      bg={boxColor}
      mt={2}
    >
      <LineChart
        data={{
          labels: scale,
          datasets: [
            {
              data,
            },
          ],
        }}
        width={Dimensions.get('window').width - 64}
        height={220}
        yAxisLabel="R$ "
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: boxColorHex,
          backgroundGradientFrom: boxColorHex,
          backgroundGradientTo: boxColorHex,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(217, 119, 6, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(${graphicLabelColor}, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: boxColorHex,
          },
          propsForLabels: { fontFamily: processFontFamily('montserrat-regular') },
        }}
        bezier
        style={{
          marginBottom: -10,
        }}
      />
    </Box>
  );
};
export default GraphicSpendsPerMonth1;
