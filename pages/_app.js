import React from 'react';
import '../styles/globals.css'
import { ThemeProvider } from 'styled-components';
import {
  darkTheme,
  MeetingProvider
} from 'amazon-chime-sdk-component-library-react';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <MeetingProvider>
        <Component {...pageProps} />
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default MyApp
