import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';
import TermsModal from '../components/TermsModal';

const Home = () => {
  const bg = useColorModeValue('warmGray.100', 'dark.50');

  return (
    <>
      <Center flex="1" bg={bg}>
        <Heading>HOME</Heading>
      </Center>

      <TermsModal />
    </>
  );
};

export default Home;
