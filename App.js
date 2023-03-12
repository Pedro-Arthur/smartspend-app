import React from "react";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
  Radio,
  Icon,
  Button,
  Spinner,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { StyleSheet, View } from "react-native";
import { default as theme } from "./src/theme/theme.json";

const StarIcon = (props) => (
  <Icon {...props} style={styles.icon} fill="white" name="star" />
);

const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);

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
      <Icon style={styles.icon} fill="#8F9BB3" name="facebook" />
      <Button style={styles.button} status="primary" accessoryLeft={StarIcon}>
        PRIMARY
      </Button>

      <Button style={styles.button} status="success" accessoryRight={StarIcon}>
        SUCCESS
      </Button>

      <Button style={styles.button} status="danger" accessoryLeft={StarIcon} />

      <Button
        style={styles.button}
        appearance="ghost"
        status="danger"
        accessoryLeft={StarIcon}
      />

      <Button
        style={styles.button}
        appearance="outline"
        accessoryLeft={LoadingIndicator}
      >
        LOADING
      </Button>
    </Layout>
  );
};

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <HomeScreen />
    </ApplicationProvider>
  </>
);

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    margin: 2,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});
