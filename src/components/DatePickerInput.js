import React, { useState, useRef } from 'react';
import { Input, Icon, useColorModeValue } from 'native-base';
import DatePicker from 'react-native-modern-datepicker';
import { AntDesign } from '@expo/vector-icons';

const DatePickerInput = ({ value, onChange, maximumDate, minimumDate, current, placeholder }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const inputRef = useRef(null);

  const datePickerOptions = {
    backgroundColor: useColorModeValue('#d6d3d1', '#090C08'),
    textHeaderColor: '#d97706',
    textDefaultColor: '#F6E7C1',
    selectedTextColor: useColorModeValue('#000', '#fff'),
    mainColor: '#d97706',
    textSecondaryColor: '#D6C7A1',
    borderColor: useColorModeValue('rgba(122, 146, 165, 0.1)', 'rgba(122, 146, 165, 0.1)'),
    defaultFont: 'montserrat-regular',
  };

  const onSelectedChange = (selectedValue) => {
    const dateArray = selectedValue.split('/');
    const year = parseInt(dateArray[0], 10);
    const month = parseInt(dateArray[1], 10) - 1;
    const day = parseInt(dateArray[2], 10);
    onChange(new Date(year, month, day));
    setShowDatePicker(false);
    inputRef.current.blur();
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
          mode="calendar"
          style={{ borderRadius: 8 }}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onSelectedChange={onSelectedChange}
        />
      )}
    </>
  );
};

export default DatePickerInput;
