import React, { useContext } from 'react';
import { useColorModeValue, Box, Text, Heading } from 'native-base';
import TermsModal from '../../components/TermsModal';
import TipsCarousel from '../../components/TipsCarousel';
import { getGreeting } from '../../utils/helpers';
import { AuthContext } from '../../contexts/AuthContext';

const Home = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');
  const greeting = getGreeting();
  const { user } = useContext(AuthContext);

  return (
    <>
      <Box flex="1" bg={bg}>
        <Heading size="lg" fontWeight="600" mx={4} mt={4}>
          {greeting}, {user && user.name}!
        </Heading>

        <Text fontWeight="semibold" fontSize="md" mx={4} mt={4}>
          Dicas de saúde financeira
        </Text>
        <TipsCarousel />

        <Text fontWeight="semibold" fontSize="md" mx={4}>
          Histórico de gastos
        </Text>
      </Box>

      <TermsModal />
    </>
  );
};

export default Home;
