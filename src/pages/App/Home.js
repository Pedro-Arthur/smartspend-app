import React from 'react';
import { useColorModeValue, Box } from 'native-base';
import TermsModal from '../../components/TermsModal';
import TipsCarousel from '../../components/TipsCarousel';

const Home = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');

  return (
    <>
      <Box flex="1" bg={bg}>
        <TipsCarousel />
      </Box>

      <TermsModal />
    </>
  );
};

export default Home;
