import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

const AppLoading = ({ onFinish }) => {
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
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
        });

        await SplashScreen.hideAsync();

        onFinish();
      } catch (e) {
        console.warn(e);
      }
    }

    loadFonts();
  }, []);

  return null;
};

export default AppLoading;
