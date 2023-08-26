import React, { useContext } from 'react';
import {
  useColorModeValue,
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  Divider,
  FlatList,
  Icon,
} from 'native-base';
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import TermsModal from '../../components/TermsModal';
import TipsCarousel from '../../components/TipsCarousel';
import { getGreeting } from '../../utils/helpers';
import { AuthContext } from '../../contexts/AuthContext';
import { DataContext } from '../../contexts/DataContext';

import PixIcon from '../../assets/images/historicSpends/pix.svg';
import BankIcon from '../../assets/images/historicSpends/bank.svg';

const groupAndSortSpends = (spends) => {
  const groupedSpends = spends.reduce((groups, spend) => {
    const group = groups[spend.date] || [];
    group.push(spend);
    // eslint-disable-next-line no-param-reassign
    groups[spend.date] = group;
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedSpends).sort((a, b) => b.localeCompare(a));

  const finalList = sortedDates.map((date) => {
    const values = groupedSpends[date];

    const totalSpent = values.reduce((total, obj) => {
      const numberValue = parseFloat(`${obj.value}`);
      return total + numberValue;
    }, 0);

    return {
      totalSpent,
      date,
      values,
    };
  });

  return finalList;
};

const formatDay = (dateString) => {
  const today = new Date();

  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }

  return dateString.split('-').reverse().join('/');
};

const getIconBySpendMethod = (key) => {
  switch (key) {
    case 'PIX':
      return <PixIcon width={20} height={20} fill="#d97706" />;
    case 'Boleto Bancário':
      return <MaterialCommunityIcons name="barcode-scan" />;
    case 'Transferência Bancária':
      return <BankIcon width={20} height={20} fill="#d97706" />;
    case 'Cartão de Débito':
      return <AntDesign name="creditcard" />;
    case 'Cartão de Crédito':
      return <AntDesign name="creditcard" />;
    case 'Dinheiro':
      return <MaterialIcons name="attach-money" />;
    default:
      return <MaterialIcons name="attach-money" />;
  }
};

const Home = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const boxColor = useColorModeValue('white', 'dark.100');

  const greeting = getGreeting();
  const { user } = useContext(AuthContext);
  const { spends } = useContext(DataContext);

  const sortedAndGroupedSpends = groupAndSortSpends(spends);

  return (
    <>
      <Box flex="1" bg={bg}>
        <Heading size="lg" fontWeight="600" mx={4} mt={4}>
          {greeting}, {user && user.name}!
        </Heading>

        <VStack>
          <Text fontWeight="semibold" fontSize="md" mx={4} mt={4}>
            Dicas de saúde financeira
          </Text>
          <TipsCarousel />
        </VStack>

        <VStack mb={4}>
          <Text fontWeight="semibold" fontSize="md" mx={4}>
            Histórico de gastos
          </Text>

          {sortedAndGroupedSpends.length === 0 ? (
            <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor} mt={2}>
              <Text>Nenhum gasto encontrado...</Text>
            </Box>
          ) : (
            <Box h={500} shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor} mt={2}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={sortedAndGroupedSpends}
                keyExtractor={(spendGroup) => spendGroup.date}
                renderItem={({ item }) => (
                  <VStack>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontWeight="semibold" fontSize="md">
                        {formatDay(item.date)}
                      </Text>
                      <Text fontSize="xs">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.totalSpent)}
                      </Text>
                    </HStack>

                    {item.values.map((spend) => (
                      <HStack
                        key={spend.id}
                        mt={4}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <HStack alignItems="center">
                          <Icon
                            mr={2}
                            color="primary.600"
                            fontSize={20}
                            as={getIconBySpendMethod(spend.spendMethod.name)}
                          />

                          <VStack>
                            <Text>{spend.spendMethod.name}</Text>
                            <Text fontSize="xs">{spend.category.name}</Text>
                          </VStack>
                        </HStack>

                        <Text>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(spend.value)}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                )}
                ItemSeparatorComponent={<Divider my={4} />}
              />
            </Box>
          )}
        </VStack>
      </Box>

      <TermsModal />
    </>
  );
};

export default Home;
