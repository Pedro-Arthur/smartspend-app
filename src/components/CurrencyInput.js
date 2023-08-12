import React, { useState } from 'react';
import { Input, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CurrencyInput = ({ onChangeText }) => {
  const [formattedValue, setFormattedValue] = useState('R$ 0,00');

  const formatCurrency = (value) => {
    const formatted = parseFloat(value)
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `R$ ${formatted}`;
  };

  const handleTextChange = (text) => {
    if (text) {
      const numericValue = parseFloat(text.replace(/[^\d]/g, '')) / 100;

      setFormattedValue(formatCurrency(numericValue));

      if (onChangeText) {
        onChangeText(numericValue);
      }
    }
  };

  return (
    <Input
      InputLeftElement={
        <Icon
          as={<MaterialCommunityIcons name="currency-usd" />}
          size={4}
          ml="3"
          color="muted.400"
        />
      }
      keyboardType="numeric"
      value={formattedValue}
      onChangeText={handleTextChange}
    />
  );
};

export default CurrencyInput;
