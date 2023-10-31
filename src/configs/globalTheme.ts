import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import colors from './style/colors';
import breakpoints from './style/breakpoints';
import borderRadius from './style/borderRadius';
import sizes from './style/sizes';
import spacing from './style/spacing';
import typography from './style/typography';
import zIndex from './style/z-index';
import shadow from './style/shadow';
import components from './style/components';

const overrides: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
  ...colors,
  ...breakpoints,
  ...borderRadius,
  ...sizes,
  ...shadow,
  ...spacing,
  ...spacing,
  ...typography,
  ...zIndex,
  ...components
};

export default extendTheme(overrides);
