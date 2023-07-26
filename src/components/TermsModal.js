import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal, Box, useColorModeValue, Text, ScrollView, Heading } from 'native-base';
import { Animated, Dimensions, Pressable } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContext } from '../contexts/ToastContext';
import api from '../services/api';

const screenHeight = Dimensions.get('window').height;

const TermsTab = () => (
  <ScrollView my="3">
    <Heading size="md" mb={3}>
      1. Termos
    </Heading>

    <Text>
      Ao acessar ao aplicativo SmartSpend, concorda em cumprir estes termos de serviço, todas as
      leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis
      locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou
      acessar este aplicativo. Os materiais contidos neste aplicativo são protegidos pelas leis de
      direitos autorais e marcas comerciais aplicáveis.
    </Text>

    <Heading size="md" my={3}>
      2. Uso de Licença
    </Heading>

    <Text>
      É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou
      software) no aplicativo SmartSpend, apenas para visualização transitória pessoal e não
      comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta
      licença, você não pode:
    </Text>

    <Text ml="5">2.1 modificar ou copiar os materiais;</Text>

    <Text ml="5">
      2.2 usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial
      ou não comercial);
    </Text>

    <Text ml="5">
      2.3 tentar descompilar ou fazer engenharia reversa de qualquer software contido no aplicativo
      SmartSpend;
    </Text>

    <Text ml="5">
      2.4 remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou
    </Text>

    <Text ml="5">
      2.5 transferir os materiais para outra pessoa ou espelhe os materiais em qualquer outro
      servidor.
    </Text>

    <Text>
      Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá
      ser rescindida por SmartSpend a qualquer momento. Ao encerrar a visualização desses materiais
      ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse,
      seja em formato eletrônico ou impresso.
    </Text>

    <Heading size="md" my={3}>
      3. Isenção de responsabilidade
    </Heading>

    <Text ml="5">
      3.1 Os materiais no aplicativo SmartSpend são fornecidos como estão. SmartSpend não oferece
      garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias,
      incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um
      fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
    </Text>
    <Text ml="5">
      3.2 Além disso, SmartSpend não garante ou faz qualquer representação relativa à precisão, aos
      resultados prováveis ou à confiabilidade do uso dos materiais em seu aplicativo ou de outra
      forma relacionado a esses materiais ou em sites vinculados a este aplicativo.
    </Text>

    <Heading size="md" my={3}>
      4. Limitações
    </Heading>

    <Text>
      Em nenhum caso SmartSpend ou seus fornecedores serão responsáveis por quaisquer danos
      (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos
      negócios) decorrentes do uso ou da incapacidade de usar os materiais em SmartSpend, mesmo que
      SmartSpend ou um representante autorizado da SmartSpend tenha sido notificado oralmente ou por
      escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em
      garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais,
      essas limitações podem não se aplicar a você.
    </Text>

    <Heading size="md" my={3}>
      5. Precisão dos materiais
    </Heading>

    <Text>
      Os materiais exibidos no aplicativo SmartSpend podem incluir erros técnicos, tipográficos ou
      fotográficos. SmartSpend não garante que qualquer material em seu aplicativo seja preciso,
      completo ou atual. SmartSpend pode fazer alterações nos materiais contidos em seu aplicativo a
      qualquer momento, sem aviso prévio. No entanto, SmartSpend não se compromete a atualizar os
      materiais.
    </Text>

    <Heading size="md" my={3}>
      6. Links
    </Heading>

    <Text>
      SmartSpend não analisou todos os sites vinculados ao seu aplicativo e não é responsável pelo
      conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por
      SmartSpend do site. O uso de qualquer site vinculado é por conta e risco do usuário.
    </Text>

    <Heading size="sm" my={3}>
      Modificações
    </Heading>

    <Text>
      SmartSpend pode revisar estes termos de serviço do aplicativo a qualquer momento, sem aviso
      prévio. Ao usar este aplicativo, você concorda em ficar vinculado à versão atual desses termos
      de serviço.
    </Text>

    <Heading size="sm" my={3}>
      Lei aplicável
    </Heading>

    <Text>
      Estes termos e condições são regidos e interpretados de acordo com as leis da SmartSpend e
      você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou
      localidade.
    </Text>
  </ScrollView>
);

const PolicyTab = () => (
  <ScrollView my="3">
    <Text mb="3">
      A sua privacidade é importante para nós. É política da SmartSpend respeitar a sua privacidade
      em relação a qualquer informação sua que possamos coletar no aplicativo SmartSpend, e outros
      aplicativos que possuímos e operamos.
    </Text>

    <Text mb="3">
      Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um
      serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também
      informamos por que estamos coletando e como será usado.
    </Text>

    <Text mb="3">
      Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço
      solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis
      para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não
      autorizados.
    </Text>

    <Text mb="3">
      Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto
      quando exigido por lei.
    </Text>

    <Text mb="3">
      O nosso aplicativo pode ter links para sites externos que não são operados por nós. Esteja
      ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos
      aceitar responsabilidade por suas respectivas políticas de privacidade.
    </Text>

    <Text mb="3">
      Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez
      não possamos fornecer alguns dos serviços desejados.
    </Text>

    <Text mb="3">
      O uso continuado de nosso aplicativo será considerado como aceitação de nossas práticas em
      torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos
      com dados do usuário e informações pessoais, entre em contato conosco.
    </Text>

    <Heading size="md" mb="3">
      Compromisso do Usuário
    </Heading>

    <Text>
      O usuário se compromete a fazer uso adequado dos conteúdos e da informação que a SmartSpend
      oferece no aplicativo e com caráter enunciativo, mas não limitativo:
    </Text>

    <Text ml="5">
      A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;
    </Text>

    <Text ml="5">
      B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo
      de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;
    </Text>

    <Text ml="5">
      C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) da SmartSpend, de
      seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer
      outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente
      mencionados.
    </Text>
  </ScrollView>
);

const renderScene = SceneMap({
  first: TermsTab,
  second: PolicyTab,
});

const Tabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'first',
      title: 'Termos',
    },
    {
      key: 'second',
      title: 'Política',
    },
  ]);

  const textColor = useColorModeValue('#000', '#e5e5e5');
  const inactiveBorderColor = useColorModeValue('coolGray.200', 'gray.400');

  const getBorderColor = (i) => (index === i ? 'primary.600' : inactiveBorderColor);

  const renderTabBar = ({ navigationState }) => (
    <Box flexDirection="row">
      {navigationState.routes.map((route, i) => (
        <Box
          key={route.key}
          borderBottomWidth="3"
          borderColor={getBorderColor(i)}
          flex={1}
          alignItems="center"
          p="3"
          cursor="pointer"
        >
          <Pressable
            onPress={() => {
              setIndex(i);
            }}
          >
            <Animated.Text
              style={{
                color: textColor,
                fontFamily: 'montserrat-regular',
              }}
            >
              {route.title}
            </Animated.Text>
          </Pressable>
        </Box>
      ))}
    </Box>
  );

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
    />
  );
};

const TermsModal = () => {
  const { showToast } = useContext(ToastContext);
  const { setAuthUser, user, token } = useContext(AuthContext);

  const [modalTermsVisible, setModalTermsVisible] = useState(false);

  const acceptTerms = async () => {
    try {
      await api.patch(
        '/users',
        {
          hasAcceptedTerms: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await setAuthUser({ ...user, hasAcceptedTerms: true });

      setModalTermsVisible(false);
    } catch (error) {
      showToast({
        title: 'Ops!',
        description: error?.response?.data?.message || 'Erro ao aceitar os termos.',
        variant: 'solid',
        isClosable: true,
        status: 'error',
      });
    }
  };

  const handleModalTermsVisible = async () => {
    const storageUser = await AsyncStorage.getItem('@user');
    const parsedUser = storageUser ? JSON.parse(storageUser) : null;

    if (parsedUser && parsedUser.hasAcceptedTerms === false) {
      setModalTermsVisible(true);
    }
  };

  useEffect(() => {
    handleModalTermsVisible();
  }, []);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={modalTermsVisible}
      onClose={setModalTermsVisible}
      size="xl"
    >
      <Modal.Content>
        <Modal.Header>Nossos termos</Modal.Header>

        <Modal.Body h={screenHeight * 0.5}>
          <Tabs />
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
