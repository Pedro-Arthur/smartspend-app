import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
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

const logoOpacityAnimationTime = 2000;
const circleScaleItemAnimationTime = 500;
const circleScaleLoopTime = 3000;

const AppLoading = ({ onFinish }) => {
  const logoOpacity = new Animated.Value(0);
  const circleScale = new Animated.Value(1);

  useEffect(() => {
    Font.loadAsync(fonts);

    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: logoOpacityAnimationTime,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circleScale, {
            toValue: 1.2,
            duration: circleScaleItemAnimationTime,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(circleScale, {
            toValue: 1,
            duration: circleScaleItemAnimationTime,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    setTimeout(() => onFinish(), logoOpacityAnimationTime + circleScaleLoopTime);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circleContainer, { transform: [{ scale: circleScale }] }]}>
        <Animated.Image
          source={require('../assets/images/outline-icon.png')}
          style={[styles.logo, { opacity: logoOpacity }]}
        />
      </Animated.View>
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
    width: 70,
    resizeMode: 'contain',
  },
  circleContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100,
    padding: 10,
  },
});

export default AppLoading;
