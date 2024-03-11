import {createStitches} from '@stitches/react';
import {slate, slateDark, indigo, indigoDark} from '@radix-ui/colors';

export const {styled, css, globalCss, keyframes, getCssText, theme, createTheme, config} = createStitches({
  media: {
    small: '(max-width: 640px)',
    xsmall: '(max-width: 200px)',
  },
  theme: {
    colors: {
      ...slate,
      ...indigo,
    },
  },
});

export const darkTheme = createTheme({
  colors: {
    ...slateDark,
    ...indigoDark,
  },
});
