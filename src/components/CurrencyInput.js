import React, { useState } from 'react';
import { Input, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const formatCurrency = (v) => {
  const formatted = parseFloat(v)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${formatted}`;
};

const CurrencyInput = ({ value, onChangeText, maxDigits }) => {
  const [formattedValue, setFormattedValue] = useState(formatCurrency(value || 0));

  const handleTextChange = (text) => {
    if (text) {
      const numericValue = parseFloat(text.replace(/[^\d]/g, '')) / 100;

      if (maxDigits !== undefined && text.replace(/[^\d]/g, '').length > maxDigits) {
        const truncatedValue = text.slice(0, maxDigits);
        const truncatedNumericValue = parseFloat(truncatedValue.replace(/[^\d]/g, '')) / 100;

        setFormattedValue(formatCurrency(truncatedNumericValue));
        if (onChangeText) {
          onChangeText(truncatedNumericValue);
        }
      } else {
        setFormattedValue(formatCurrency(numericValue));
        if (onChangeText) {
          onChangeText(numericValue);
        }
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
