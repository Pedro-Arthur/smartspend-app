import React from "react";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
  Radio,
  Icon,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text category="h1">HOME</Text>
      <Radio
        checked={checked}
        onChange={(nextChecked) => setChecked(nextChecked)}
      >
        {`Checked: ${checked}`}
      </Radio>
      <Icon style={styles.icon} fill="#8F9BB3" name="star" />
    </Layout>
  );
};

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.dark}>
      <HomeScreen />
    </ApplicationProvider>
  </>
);

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
