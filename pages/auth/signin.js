import Head from 'next/head'
import {
  getProviders,
  getSession,
  useSession,
  signIn,
  getCsrfToken
} from 'next-auth/react'
import {useState} from 'react'
import Navigation from '../../components/Navigation'
import {
  PaperPlaneIcon,
  TwitterLogoIcon
} from '@radix-ui/react-icons'
import {
  Button,
  Input,
  Label,
  Container,
  Flex,
  Box,
  Text,
  Grid,
  Heading,
  Card,
  Themed
}           from 'theme-ui'

export default function SignInPage({providers, csrfToken}) {
  const {data: session} = useSession()
  const colors = {
    Twitter: '#4a99e9'
  }

  const icons = {
    Twitter: <TwitterLogoIcon />,
    Email:   <PaperPlaneIcon />
  }

  return (
    <>
      <Head>
        <title>Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation session={session} />

      <Container>
        <Flex
          sx={{
            justifyContent: 'center'
          }}>
          <Box
            mt={3}
            p={3}
            sx={{
              width: 400,
              maxWidth: '100%',
              boxShadow: 'primary',
              borderRadius: 6
            }}
            bg='white'
            as='main'>
            <Heading
              pb={4}
              variant='headline'
              sx={{
                textAlign: 'center'
              }}>
              Sign in
            </Heading>
            <Grid
              gap={2}>
              {Object.values(providers).map((provider) => (
                <Box key={provider.name}>
                  {provider.name === "Twitter" ? (
                    <Flex sx={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      <Button py={2} sx={{width: '100%'}} bg={colors[provider.name]} onClick={() => signIn(provider.id)}>
                        <Flex sx={{justifyContent: 'center', alignItems: 'center', gap: 2}}>
                          {icons[provider.name]}
                          Sign in with {provider.name}
                        </Flex>
                      </Button>

                      <Text py={3}>or</Text>
                    </Flex>
                  ) : (
                    <Flex sx={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      <form style={{width: '100%'}} method="post" action="/api/auth/signin/email">
                        <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <Label
                          htmlFor='email'>
                          Email address
                        </Label>
                        <Input required mb={2} sx={{border: theme => `1px solid ${theme.colors.lightgray}`}} placeholder='example@domain.com' type="email" id="email" name="email" />
                        <Button py={2} sx={{width: '100%'}} bg={colors[provider.name]}>
                          <Flex sx={{justifyContent: 'center', alignItems: 'center', gap: 2}}>
                            {icons[provider.name]}
                            Sign in with {provider.name}
                          </Flex>
                        </Button>
                      </form>
                    </Flex>
                  )}
                </Box>
              ))}
            </Grid>
          </Box>
        </Flex>
      </Container>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(ctx)
  const session   = await getSession()

  return {
    props: {
      providers,
      session,
      csrfToken
    },
  }
}
