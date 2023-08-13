import React, { useState, useRef } from 'react';
import { Input, Icon, useColorModeValue, Modal } from 'native-base';
import DatePicker from 'react-native-modern-datepicker';
import { AntDesign } from '@expo/vector-icons';

const DatePickerInput = ({ value, onChange, maximumDate, minimumDate, placeholder }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const inputRef = useRef(null);

  const datePickerOptions = {
    backgroundColor: useColorModeValue('#fafafa', '#27272a'),
    textHeaderColor: '#d97706',
    textDefaultColor: useColorModeValue('#000', '#fff'),
    selectedTextColor: '#fff',
    mainColor: '#d97706',
    textSecondaryColor: '#737373',
    borderColor: useColorModeValue('#e5e5e5', 'rgba(122, 146, 165, 0.1)'),
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

  const onCloseModal = () => {
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

      <Modal isOpen={showDatePicker} onClose={onCloseModal} size="xl">
        <Modal.Content>
          <Modal.Header>{placeholder}</Modal.Header>
          <Modal.CloseButton />
          <Modal.Body p={0}>
            <DatePicker
              options={datePickerOptions}
              mode="calendar"
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onSelectedChange={onSelectedChange}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default DatePickerInput;
