import React, { useState, useRef } from 'react';
import { Input, Icon } from 'native-base';
import DatePicker from 'react-native-modern-datepicker';
import { AntDesign } from '@expo/vector-icons';
import { formatDate } from '../utils/helpers';

const DatePickerInput = ({ value, onChange, maximumDate, minimumDate, current, placeholder }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const inputRef = useRef(null);

  console.log(placeholder);

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
          options={{
            backgroundColor: '#090C08',
            textHeaderColor: '#FFA25B',
            textDefaultColor: '#F6E7C1',
            selectedTextColor: '#fff',
            mainColor: '#F4722B',
            textSecondaryColor: '#D6C7A1',
            borderColor: 'rgba(122, 146, 165, 0.1)',
          }}
          current={current}
          selected={formatDate(value)}
          mode="calendar"
          style={{ borderRadius: 10 }}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </>
  );
};

export default DatePickerInput;
