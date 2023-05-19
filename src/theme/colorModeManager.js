import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@color-mode';
const DARK_MODE = 'dark';
const LIGHT_MODE = 'light';

const colorModeManager = {
  get: async () => {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEY);
      return val === DARK_MODE ? DARK_MODE : LIGHT_MODE;
    } catch (e) {
      return LIGHT_MODE;
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      console.error(e);
    }
  },
};

export default colorModeManager;
