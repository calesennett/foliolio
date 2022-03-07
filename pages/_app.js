import '../styles/globals.css'
import '../styles/fonts.css'
import {
  ThemeProvider
}            from 'theme-ui'
import {SessionProvider} from 'next-auth/react'
import theme from '../components/theme'

function MyApp({
  Component,
  pageProps: {session, ...pageProps}
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
