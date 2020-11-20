import '../styles/globals.css'
import ChimeProvider from "../providers/ChimeProvider";

function MyApp({ Component, pageProps }) {
  return <ChimeProvider>
    <Component {...pageProps} />
  </ChimeProvider>
}

export default MyApp
