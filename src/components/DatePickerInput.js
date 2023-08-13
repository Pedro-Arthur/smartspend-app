import React, { useState, useRef } from 'react';
import { Input, Icon, useColorModeValue } from 'native-base';
import DatePicker from 'react-native-modern-datepicker';
import { AntDesign } from '@expo/vector-icons';
import { formatDate } from '../utils/helpers';

const DatePickerInput = ({ value, onChange, maximumDate, minimumDate, current, placeholder }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const inputRef = useRef(null);

  const datePickerOptions = {
    backgroundColor: useColorModeValue('#090C08', '#090C08'),
    textHeaderColor: '#d97706',
    textDefaultColor: '#F6E7C1',
    selectedTextColor: useColorModeValue('#fff', '#fff'),
    mainColor: '#d97706',
    textSecondaryColor: '#D6C7A1',
    borderColor: useColorModeValue('rgba(122, 146, 165, 0.1)', 'rgba(122, 146, 165, 0.1)'),
    defaultFont: 'montserrat-regular',
  };

  return (
    <>
      <Input
        ref={inputRef}
        InputLeftElement={
          <Icon as={<AntDesign name="calendar" />} size={4} ml="3" color="muted.400" />
        }
        onFocus={() => setShowDatePicker(true)}
        value={value ? value.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : value}
        showSoftInputOnFocus={false}
        placeholder={placeholder}
      />

      {showDatePicker && (
        <DatePicker
          options={datePickerOptions}
          current={current}
          selected={formatDate(value)}
          mode="calendar"
          style={{ borderRadius: 8 }}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </>
  );
};

export default DatePickerInput;
