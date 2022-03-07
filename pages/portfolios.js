import Head from 'next/head'
import Image from 'next/image'
import {useState} from 'react'
import {useSession, getSession} from 'next-auth/react'
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
  FontRomanIcon
} from '@radix-ui/react-icons'
import {useRef}   from 'react'
import Link       from 'next/link'
import Navigation from '../components/Navigation'
import sampleImage from '../public/images/sample.jpg'

export default function Home({portfolios}) {
  const headlineRef    = useRef()
  const subheadlineRef = useRef()
  const [portfolioItems, setPortfolioItems] = useState([])
  const { data: session } = useSession()

  async function updatePortfolio() {
    fetch(`/api/portfolios/${portfolio.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        headline: headlineRef.current.textContent,
        subheadline: subheadlineRef.current.textContent
      })
    }).then(res => {
      console.log('success')
    }).catch(err => {
      console.error(err)
    })
  }

  return (
    <>
      <Head>
        <title>Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation session={session}/>
      <Container
        as='main'>
        <Box
          pb={4}>
          <Text>
            Customize your portfolio headline, subheadline, and items below.
          </Text>
        </Box>

        <Box
          pb={4}>
          <Heading
            as='h1'
            color='text'
            pb={2}>
            <Flex
              ref={headlineRef}
              onBlur={() => updatePortfolio()}
              contentEditable={true}
              suppressContentEditableWarning={true}
              sx={{
                alignItems: 'center',
                gap: 2
              }}>
              <FontRomanIcon />
              {portfolio.headline}
            </Flex>
          </Heading>
          <Box
            sx={{
              maxWidth: '65ch'
            }}>
            <Text>
              <Flex
                ref={subheadlineRef}
                onBlur={() => updatePortfolio()}
                suppressContentEditableWarning={true}
                contentEditable={true}
                sx={{
                  alignItems: 'center',
                  gap: 2
                }}>
                <Box
                  sx={{
                    minWidth: 15
                  }}>
                  <FontRomanIcon />
                </Box>
                {portfolio.subheadline}
              </Flex>
            </Text>
          </Box>
        </Box>

        <Grid
          columns={[1, null, 2]}
          gap={3}>
          {portfolioItems &&
            <>
              {portfolioItems.map((item, idx) => {
                return (
                  <Box className='card' key={item.id} as='a' href={item.url}>
                    <Box
                      sx={{
                        borderRadius: 6,
                        overflow: 'hidden',
                        position: 'relative',
                        height: [300, null, 200],
                        width: '100%'
                      }}>
                      <Image objectFit='cover' objectPosition='top' layout='fill' src={item.thumbnail} />
                    </Box>
                    <Card key={idx} as='a' p={0} href={item.url}>
                      <Heading mt={2} variant='cardTitle'>{item.title}</Heading>
                      <Text sx={{fontSize: 1}}>{item.description}</Text>
                    </Card>
                  </Box>
                )
              })}
            </>
          }
          <Link
            href='/links/new'>
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
    </>
  )
}

export async function getServerSideProps(ctx) {
  const res = await fetch(`${process.env.HOSTNAME}/api/portfolios`)
  const portfolios = await res.json()
  const session = await getSession(ctx)

  return {
    props: {
      session: session,
      portfolios: portfolios
    }
  }
}
