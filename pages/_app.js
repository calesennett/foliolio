import '../styles/fonts.css'
import {
  ThemeProvider
}            from 'theme-ui'
import {SessionProvider} from 'next-auth/react'
import theme from '../components/theme'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'

function MyApp({
  Component,
  pageProps: {session, ...pageProps}
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
