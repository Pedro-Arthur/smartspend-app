import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import * as Splash from 'expo-splash-screen';
import * as Font from 'expo-font';

const fonts = {
  'montserrat-thin': require('../assets/fonts/Montserrat-Thin.ttf'),
  'montserrat-thin-italic': require('../assets/fonts/Montserrat-ThinItalic.ttf'),

  'montserrat-extra-light': require('../assets/fonts/Montserrat-ExtraLight.ttf'),
  'montserrat-extra-light-italic': require('../assets/fonts/Montserrat-ExtraLightItalic.ttf'),

  'montserrat-light': require('../assets/fonts/Montserrat-Light.ttf'),
  'montserrat-light-italic': require('../assets/fonts/Montserrat-LightItalic.ttf'),

  'montserrat-regular': require('../assets/fonts/Montserrat-Regular.ttf'),
  'montserrat-italic': require('../assets/fonts/Montserrat-Italic.ttf'),

  'montserrat-medium': require('../assets/fonts/Montserrat-Medium.ttf'),
  'montserrat-medium-italic': require('../assets/fonts/Montserrat-MediumItalic.ttf'),

  'montserrat-semi-bold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  'montserrat-semi-bold-italic': require('../assets/fonts/Montserrat-SemiBoldItalic.ttf'),

  'montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  'montserrat-bold-italic': require('../assets/fonts/Montserrat-BoldItalic.ttf'),

  'montserrat-extra-bold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
  'montserrat-extra-bold-italic': require('../assets/fonts/Montserrat-ExtraBoldItalic.ttf'),

  'montserrat-black': require('../assets/fonts/Montserrat-Black.ttf'),
  'montserrat-black-italic': require('../assets/fonts/Montserrat-BlackItalic.ttf'),
};

const AppLoading = ({ onFinish }) => {
  const logoOpacity = new Animated.Value(0);

  const load = async () => {
    try {
      await Font.loadAsync(fonts);
      await Splash.hideAsync();
      setTimeout(() => onFinish(), 4000);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  useEffect(() => {
    load();

    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/outline-icon.png')}
        style={[styles.logo, { opacity: logoOpacity }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d97706',
  },
  logo: {
    width: 150,
    resizeMode: 'contain',
  },
});

export default AppLoading;
