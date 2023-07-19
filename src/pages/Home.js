import React from 'react';
import { useColorModeValue, Heading, Center } from 'native-base';
import TermsModal from '../components/TermsModal';

const Home = () => {
  const bg = useColorModeValue('warmGray.50', 'coolGray.800');

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
