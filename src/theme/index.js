import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#F5F0FB',
      100: '#EADBFF',
      200: '#E5D0FE',
      300: '#C9A1FD',
      400: '#A872F9',
      500: '#8B4EF3',
      600: '#5E17EB',
      700: '#4810CA',
      800: '#350BA9',
      900: '#250788',
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
