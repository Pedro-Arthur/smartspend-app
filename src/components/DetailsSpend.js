import React from 'react';
import { Text, HStack, VStack, Modal } from 'native-base';

const DetailsSpend = ({
  detailsSpendModalVisible,
  setDetailsSpendModalVisible,
  closeRow,
  setCurrentSpendDetails,
  currentSpendDetails,
  customCardText,
}) => (
  <Modal
    isOpen={detailsSpendModalVisible}
    size="xl"
    onClose={() => {
      setDetailsSpendModalVisible(false);
      closeRow(currentSpendDetails.rowMap, currentSpendDetails.id);
      setCurrentSpendDetails(null);
    }}
  >
    <Modal.Content>
      <Modal.CloseButton />
      <Modal.Header>Detalhes do gasto</Modal.Header>
      <Modal.Body>
        {currentSpendDetails && (
          <>
            <HStack justifyContent="space-between">
              <VStack>
                <Text fontSize="xs" color="muted.400">
                  Valor
                </Text>
                <Text fontWeight="semibold" color={customCardText}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(currentSpendDetails.value)}
                </Text>
              </VStack>

              <VStack>
                <Text fontSize="xs" color="muted.400">
                  Data
                </Text>
                <Text fontWeight="semibold" color={customCardText}>
                  {currentSpendDetails.date.split('-').reverse().join('/')}
                </Text>
              </VStack>
            </HStack>

            <HStack mt={4} justifyContent="space-between">
              <VStack>
                <Text fontSize="xs" color="muted.400">
                  Categoria
                </Text>
                <Text fontWeight="semibold" color={customCardText}>
                  {currentSpendDetails.category.name}
                </Text>
              </VStack>

              <VStack>
                <Text fontSize="xs" color="muted.400">
                  Método
                </Text>
                <Text fontWeight="semibold" color={customCardText}>
                  {currentSpendDetails.spendMethod.name}
                </Text>
              </VStack>
            </HStack>

            {currentSpendDetails.spendMethod.key !== 'money' &&
              currentSpendDetails.spendMethod.key !== 'ticket' && (
                <>
                  {(currentSpendDetails.spendMethod.key === 'pix' ||
                    currentSpendDetails.spendMethod.key === 'transfer') && (
                    <>
                      <HStack mt={4} justifyContent="space-between">
                        <VStack>
                          <Text fontSize="xs" color="muted.400">
                            Conta
                          </Text>
                          <Text fontWeight="semibold" color={customCardText}>
                            {currentSpendDetails.bankAccount.number}-
                            {currentSpendDetails.bankAccount.digit}
                          </Text>
                        </VStack>

                        <VStack>
                          <Text fontSize="xs" color="muted.400">
                            Agência
                          </Text>
                          <Text fontWeight="semibold" color={customCardText}>
                            {currentSpendDetails.bankAccount.agency}
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack mt={4} justifyContent="space-between">
                        <VStack>
                          <Text fontSize="xs" color="muted.400">
                            Banco
                          </Text>
                          <Text fontWeight="semibold" color={customCardText}>
                            {currentSpendDetails.bankAccount.bank.name}
                          </Text>
                        </VStack>
                      </HStack>
                    </>
                  )}

                  {(currentSpendDetails.spendMethod.key === 'credit' ||
                    currentSpendDetails.spendMethod.key === 'debit') && (
                    <>
                      <HStack mt={4} justifyContent="space-between">
                        <VStack>
                          <Text fontSize="xs" color="muted.400">
                            Cartão (Últimos 4 números)
                          </Text>
                          <Text fontWeight="semibold" color={customCardText}>
                            {currentSpendDetails.bankCard.lastFourNumbers}
                          </Text>
                        </VStack>
                      </HStack>
                      <HStack mt={4} justifyContent="space-between">
                        <VStack>
                          <Text fontSize="xs" color="muted.400">
                            Banco
                          </Text>
                          <Text fontWeight="semibold" color={customCardText}>
                            {currentSpendDetails.bankCard.bankAccount.bank.name}
                          </Text>
                        </VStack>
                      </HStack>
                    </>
                  )}
                </>
              )}

            <HStack mt={4} justifyContent="space-between">
              <VStack>
                <Text fontSize="xs" color="muted.400">
                  Descrição
                </Text>
                <Text fontWeight="semibold" color={customCardText}>
                  {currentSpendDetails.description}
                </Text>
              </VStack>
            </HStack>
          </>
        )}
      </Modal.Body>
    </Modal.Content>
  </Modal>
);

export default DetailsSpend;
