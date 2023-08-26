import React, { useContext } from 'react';
import {
  useColorModeValue,
  Box,
  Text,
  Heading,
  HStack,
  Avatar,
  VStack,
  Divider,
  FlatList,
} from 'native-base';
import TermsModal from '../../components/TermsModal';
import TipsCarousel from '../../components/TipsCarousel';
import { getGreeting } from '../../utils/helpers';
import { AuthContext } from '../../contexts/AuthContext';
import { DataContext } from '../../contexts/DataContext';

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

        <VStack>
          <Text fontWeight="semibold" fontSize="md" mx={4}>
            Histórico de gastos
          </Text>
          <Box shadow={2} mx={4} p={4} borderRadius={8} bg={boxColor} mt={2}>
            {sortedAndGroupedSpends.length === 0 && <Text>Nenhum gasto encontrado...</Text>}
            <FlatList
              data={sortedAndGroupedSpends}
              keyExtractor={(spendGroup) => spendGroup.date}
              renderItem={({ item, index }) => (
                <VStack mt={index > 0 ? 6 : 0}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text mb={2} fontWeight="semibold" fontSize="md">
                      {formatDay(item.date)}
                    </Text>
                    <Text mb={2} fontSize="xs">
                      Total:{' '}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.totalSpent)}
                    </Text>
                  </HStack>

                  <FlatList
                    data={item.values}
                    keyExtractor={(spend) => spend.id}
                    // eslint-disable-next-line no-shadow
                    renderItem={({ item }) => (
                      <HStack justifyContent="space-between" alignItems="center">
                        <HStack alignItems="center">
                          <Avatar mr={2} size="30px" bg="primary.600" _text={{ color: 'white' }}>
                            a
                          </Avatar>
                          <VStack>
                            <Text>{item.spendMethod.name}</Text>
                            <Text>{item.category.name}</Text>
                          </VStack>
                        </HStack>

                        <Text>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.value)}
                        </Text>
                      </HStack>
                    )}
                    ItemSeparatorComponent={<Divider my={2} />}
                  />
                </VStack>
              )}
            />
          </Box>
        </VStack>
      </Box>

      <TermsModal />
    </>
  );
};

export default Home;
