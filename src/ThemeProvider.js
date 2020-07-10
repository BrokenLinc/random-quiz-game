import React from 'react';
import {
  CSSReset,
  ThemeProvider as DefaultThemeProvider,
  theme,
} from '@chakra-ui/core';

const customTheme = {
  ...theme,
  fonts: {
    ...theme.fonts,
    body: 'Montserrat, sans-serif',
    heading: 'Montserrat, sans-serif',
  },
  fontWeights: {
    ...theme.fontWeights,
    normal: 300,
    medium: 400,
    bold: 600,
  },
};

const ThemeProvider = (props) => (
  <DefaultThemeProvider theme={customTheme}>
    <CSSReset />
    {props.children}
  </DefaultThemeProvider>
);

export default ThemeProvider;
