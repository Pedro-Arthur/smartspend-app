import React from 'react';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { processFontFamily } from 'expo-font';
import { Box, useColorModeValue } from 'native-base';

const SpendMethodsMostUsed = ({ data }) => {
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
            name: 'PIX',
            spends: data.find((d) => d.key === 'pix').spends,
            color: '#1abc9c',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'Transferência',
            spends: data.find((d) => d.key === 'transfer').spends,
            color: '#3498db',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'Crédito',
            spends: data.find((d) => d.key === 'credit').spends,
            color: '#9b59b6',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'Débito',
            spends: data.find((d) => d.key === 'debit').spends,
            color: '#f1c40f',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'Dinheiro',
            spends: data.find((d) => d.key === 'money').spends,
            color: '#e67e22',
            legendFontColor: labelColor,
            legendFontSize: 12,
            legendFontFamily: processFontFamily('montserrat-regular'),
          },
          {
            name: 'Boleto',
            spends: data.find((d) => d.key === 'ticket').spends,
            color: '#e74c3c',
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
        accessor="spends"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </Box>
  );
};

export default SpendMethodsMostUsed;
