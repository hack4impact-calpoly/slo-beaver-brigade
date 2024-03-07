import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
    custom: 1000,
  },
  styles: {
    global: {
      // Add text shadow for bold effect
      '.bold-text': {
        textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
      },
    },
  },
});

export default theme;
