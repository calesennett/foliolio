import {useSession, getSession} from 'next-auth/react'
import Head from 'next/head'
import Navigation from '../../components/Navigation'
import Image from 'next/image'
import PortfolioItems from '../../components/Portfolio/PortfolioItems'
import prisma         from '../../lib/prisma'
import {
  Container,
  Box,
  Heading,
  Flex,
  Grid,
  Text,
  ThemeProvider
} from 'theme-ui'

export default function PortfolioPage({portfolio}) {
  const {data: session} = useSession()
  /*const theme = {
    colors: {
      background: '#000',
      text: '#fff'
    },
    cards: {
      primary: {
        bg: 'primary',
        color: 'white'
      }
    }
  }*/
  const theme = {
    colors: {
      background: ''
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh'
        }}
        bg='background'>
        <Head>
          <title>{portfolio.headline} | Foliolio</title>
          <meta name="description" content="quick portfolio" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {session &&
          <Navigation portfolio session={session}/>
        }

        <Container
          py={4}
          as='main'>
          <Grid
            columns={[1, '1fr 3fr', '1fr 4fr']}
            sx={{
              alignItems: 'start',
              gap: 4,
              pb: 4
            }}>
            {portfolio.thumbnail &&
              <Box
                sx={{
                  mx: ['auto', 0],
                  width: 100,
                  height: 100,
                  borderRadius: 9999,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'default',
                }}>
                <Image src={portfolio.thumbnail} objectPosition='center' alt={`Avatar for ${portfolio.headline}`} objectFit='cover' layout='fill' />
              </Box>
            }
            <Box
              sx={{
                textAlign: ['center', 'left']
              }}
              pb={4}>
              <Heading
                as='h1'
                pb={2}>
                {portfolio.headline}
              </Heading>
              <Box
                sx={{
                  maxWidth: '65ch'
                }}>
                <Text>
                  {portfolio.subheadline}
                </Text>
              </Box>
            </Box>
          </Grid>

          <PortfolioItems items={portfolio.portfolioItems} />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  const {id}    = ctx.query
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id: id,
      ...(session === null) && {published: true},
      ...(session !== null) && {
        OR: [
          {
            user: {
              is: {
                email: session.user.email
              }
            }
          },
          {
            published: true
          }
        ]
      }
    },
    include: {
      portfolioItems: true
    }
  })

  if (portfolio) {
    return {
      props: {
        session: session,
        portfolio: portfolio
      }
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
}
