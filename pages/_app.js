import '../styles/fonts.css'
import {
  ThemeProvider
}            from 'theme-ui'
import {SessionProvider} from 'next-auth/react'
import theme from '../components/theme'
import {ToastContainer, cssTransition} from 'react-toastify';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'

function MyApp({
  Component,
  pageProps: {session, ...pageProps}
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <ToastContainer
          theme='dark'
          hideProgressBar={true}
          closeButton={false}
          autoClose={3000}
          transition={cssTransition({
            enter: 'animate__animated animate__zoomIn',
            exit: 'animate__animated animate__zoomOut'
          })}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
