import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import theme from '../theme';

function CoLab({ Component, pageProps }: any) {
  console.log(pageProps);
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default CoLab;
