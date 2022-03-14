import Head from 'next/head'
import Image from 'next/image'
import {useState} from 'react'
import {useSession, getSession} from 'next-auth/react'
import prisma from '../lib/prisma'
import {
  Button,
  Container,
  Flex,
  Box,
  Text,
  Grid,
  Heading,
  Card,
  Themed
}           from 'theme-ui'
import {
  PlusIcon,
  FontRomanIcon,
  Pencil1Icon
} from '@radix-ui/react-icons'
import {useRef}   from 'react'
import Link       from 'next/link'
import Navigation from '../components/Navigation'
import sampleImage from '../public/images/sample.jpg'

export default function Home({portfolios}) {
  const { data: session } = useSession()
  const publishedPortfolios = portfolios.filter(portfolio => portfolio.published)
  const draftPortfolios     = portfolios.filter(portfolio => !portfolio.published)

  return (
    <>
      <Head>
        <title>Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation session={session}/>

      {session ? (
        <>
          {portfolios.length > 0 ?
            (
              <Container
                sx={{
                }}
                as='main'>
                <Box>
                  <Flex
                    pb={2}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                    <Heading pb={3} variant='headline'>Your portfolios</Heading>
                    <Link
                      href='/portfolios/new'>
                      <a><Button>Create portfolio</Button></a>
                    </Link>
                  </Flex>

                  <Heading variant='cardTitle'>Published</Heading>
                  {publishedPortfolios.length > 0 ? (
                      <Grid
                        gap={2}>
                        {publishedPortfolios.map(portfolio => {
                          return (
                            <Card variant='fullWidth' sx={{boxShadow: 'card'}} bg='white' key={portfolio.id}>
                              <Grid
                                columns={[1, null, 2]}
                                sx={{
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                <Box>
                                  <Heading variant='cardTitle'>{portfolio.headline}</Heading>
                                  <Text>{portfolio.subheadline}</Text>
                                </Box>
                                <Box sx={{justifySelf: [null, null, 'end']}}>
                                  <Link href={`/portfolios/${portfolio.id}/edit`}>
                                    <a>
                                      <Button>
                                        <Flex sx={{gap: 2, alignItems: 'center'}}><Pencil1Icon />Edit</Flex>
                                      </Button>
                                    </a>
                                  </Link>
                                </Box>
                              </Grid>
                            </Card>
                          )
                        })}
                      </Grid>
                    ) : (
                      <Text sx={{fontSize: 1}}>No published portfolios.</Text>
                    )
                  }

                  <Heading pt={4} variant='cardTitle'>Drafts</Heading>
                  {draftPortfolios.length > 0 ? (
                    <Grid
                      gap={2}>
                      {draftPortfolios.map(portfolio => {
                        return (
                          <Card variant='fullWidth' sx={{boxShadow: 'card'}} bg='white' key={portfolio.id}>
                            <Grid
                              columns={[1, null, 2]}
                              sx={{
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                              <Box>
                                <Heading variant='cardTitle'>{portfolio.headline}</Heading>
                                <Text>{portfolio.subheadline}</Text>
                              </Box>
                              <Box sx={{justifySelf: [null, null, 'end']}}>
                                <Link href={`/portfolios/${portfolio.id}/edit`}>
                                  <a>
                                    <Button>
                                      <Flex sx={{gap: 2, alignItems: 'center'}}><Pencil1Icon />Edit</Flex>
                                    </Button>
                                  </a>
                                </Link>
                              </Box>
                            </Grid>
                          </Card>
                        )
                      })}
                    </Grid>
                  ) : (
                    <Text sx={{fontSize: 1}}>No draft portfolios.</Text>
                  )}
                </Box>
              </Container>
            ) : (
            <Container
              as='main'>
              <Box
                pb={4}>
                <Heading variant='headline'>Your portfolios</Heading>
                <Text>
                  Create your first portfolio below.
                </Text>
              </Box>

              <Grid
                columns={[1, null, 2]}
                gap={3}>
                <Link
                  href='/portfolios/new'>
                  <Button
                    p={4}
                    sx={{
                      position: 'relative'
                    }}
                    variant='outline'>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}>
                      <PlusIcon height={20} width='auto' />
                    </Box>
                  </Button>
                </Link>
              </Grid>

              <Box py={4} sx={{float: 'right'}}>
                <Button>Publish</Button>
              </Box>
            </Container>
          )}
        </>
      ) : (
        <Container
          as='main'>
          <Box
            pb={4}>
            <Heading variant='headline'>The fastest way show off.</Heading>
            <Text>
              Sign in to create your first portfolio.
            </Text>
          </Box>
        </Container>
      )}

    </>
  )
}

export async function getServerSideProps(ctx) {
  const session    = await getSession(ctx)
  var portfolios   = []

  if (session) {
    portfolios = await prisma.portfolio.findMany({
      where: {
        user: {
          is: {
            email: session.user.email
          }
        }
      }
    })
  }

  return {
    props: {
      session: session,
      portfolios: portfolios
    }
  }
}
