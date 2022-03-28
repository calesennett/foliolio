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
  TwitterLogoIcon,
  DashboardIcon
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
  Divider,
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
            mt={4}
            p={4}
            sx={{
              width: 400,
              maxWidth: '100%',
              boxShadow: 'primary',
              borderRadius: 6
            }}
            bg='white'
            as='main'>
            <Box
              sx={{
                textAlign: 'center'
              }}
              pb={4}>
              <Flex
                sx={{
                  mx: 'auto',
                  height: 100,
                  width: 100,
                  borderRadius: 9999,
                  backgroundImage: theme => `linear-gradient(to right, ${theme.colors.primary}, #000)`,
                  color: 'lightgray',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'default'
                }}>
                <Flex sx={{alignItems: 'center'}}><DashboardIcon width={30} height={30} /></Flex>
              </Flex>
              <Heading
                pt={3}
                sx={{
                  fontSize: 4
                }}
                variant='headline'>
                Welcome to Foliolio
              </Heading>
              <Text>Log in or sign up with Twitter or your email.</Text>
            </Box>
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

                      <Divider />
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
