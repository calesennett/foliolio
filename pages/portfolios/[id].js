import {useSession, getSession} from 'next-auth/react'
import Head from 'next/head'
import Navigation from '../../components/Navigation'
import PortfolioItems from '../../components/Portfolio/PortfolioItems'
import prisma         from '../../lib/prisma'
import {
  Container,
  Box,
  Heading,
  Flex,
  Text
} from 'theme-ui'

export default function PortfolioPage({portfolio}) {
  const {data: session} = useSession()
  return (
    <>
      <Head>
        <title>Customize your portfolio | Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session &&
        <Navigation portfolio session={session}/>
      }

      <Container
        py={4}
        as='main'>
        <Box
          pb={4}>
          <Heading
            as='h1'
            color='text'
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

        <PortfolioItems items={portfolio.portfolioItems} />
      </Container>
    </>
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
        user: {
          is: {
            email: session.user.email
          }
        }
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
