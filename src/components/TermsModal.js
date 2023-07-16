import React, { useState } from 'react';
import { Button, Modal, ScrollView, Text } from 'native-base';

const TermsModal = () => {
  const [modalTermsVisible, setModalTermsVisible] = useState(true);

  const acceptTerms = () => {
    setModalTermsVisible(false);
  };

  return (
    <Modal isOpen={modalTermsVisible} onClose={setModalTermsVisible} size="xl">
      <Modal.Content>
        <Modal.Header>Nossos termos</Modal.Header>
        <Modal.Body>
          <ScrollView>
            <Text>gttttttttttttttttte return mode.</Text>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button onPress={() => acceptTerms()}>Aceitar</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default TermsModal;
