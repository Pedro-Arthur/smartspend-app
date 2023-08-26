import React from 'react';
import { useDisclose, Stagger, IconButton, Icon, Fab, Box } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import PixIcon from '../assets/images/pix.svg';
import BankIcon from '../assets/images/bank.svg';

const AddSpendFab = () => {
  const { isOpen, onToggle } = useDisclose();

  return (
    <>
      <Box position="absolute" right={5} bottom={63}>
        <Stagger
          visible={isOpen}
          initial={{
            opacity: 0,
            scale: 0,
            translateY: 34,
          }}
          animate={{
            translateY: 0,
            scale: 1,
            opacity: 1,
            transition: {
              type: 'spring',
              mass: 0.8,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}
          exit={{
            translateY: 34,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 100,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}
        >
          <IconButton
            mb="4"
            variant="solid"
            bg="green.500"
            colorScheme="indigo"
            borderRadius="full"
            icon={<Icon as={<BankIcon width={24} height={24} fill="#fff" />} />}
          />
          <IconButton
            mb="4"
            variant="solid"
            bg="indigo.500"
            colorScheme="indigo"
            borderRadius="full"
            icon={<Icon as={<PixIcon width={24} height={24} fill="#fff" />} />}
          />
          <IconButton
            mb="4"
            variant="solid"
            bg="yellow.400"
            colorScheme="yellow"
            borderRadius="full"
            icon={<Icon as={AntDesign} color="white" size="6" name="creditcard" />}
          />
          <IconButton
            mb="4"
            variant="solid"
            bg="teal.400"
            colorScheme="teal"
            borderRadius="full"
            icon={<Icon as={MaterialCommunityIcons} size="6" name="barcode-scan" color="white" />}
          />
          <IconButton
            mb="4"
            variant="solid"
            bg="red.500"
            colorScheme="red"
            borderRadius="full"
            icon={<Icon as={MaterialIcons} size="6" name="attach-money" color="white" />}
          />
        </Stagger>
      </Box>

      <Fab
        size="sm"
        icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />}
        renderInPortal={false}
        onPress={onToggle}
      />
    </>
  );
};

export default AddSpendFab;
