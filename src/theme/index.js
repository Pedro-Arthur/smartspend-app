import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
  },

  fontConfig: {
    Montserrat: {
      100: {
        normal: 'montserrat-thin',
        italic: 'montserrat-thin-italic',
      },
      200: {
        normal: 'montserrat-extra-light',
        italic: 'montserrat-extra-light-italic',
      },
      300: {
        normal: 'montserrat-light',
        italic: 'montserrat-light-italic',
      },
      400: {
        normal: 'montserrat-regular',
        italic: 'montserrat-italic',
      },
      500: {
        normal: 'montserrat-medium',
        italic: 'montserrat-medium-italic',
      },
      600: {
        normal: 'montserrat-semi-bold',
        italic: 'montserrat-semi-bold-italic',
      },
      700: {
        normal: 'montserrat-bold',
        italic: 'montserrat-bold-italic',
      },
      800: {
        normal: 'montserrat-extra-bold',
        italic: 'montserrat-extra-bold-italic',
      },
      900: {
        normal: 'montserrat-black',
        italic: 'montserrat-black-italic',
      },
    },
  },

  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Montserrat',
  },
});

export default theme;
