/** @jsxImportSource theme-ui */

import Head from 'next/head'
import Image from 'next/image'
import {useState} from 'react'
import {useSession, getSession} from 'next-auth/react'
import {toast}                  from 'react-toastify'
import {
  Button,
  Container,
  Flex,
  Box,
  Text,
  Grid,
  Heading,
  Card,
  Themed,
  Label
} from 'theme-ui'
import {
  PlusIcon,
  FontRomanIcon,
  ExternalLinkIcon
} from '@radix-ui/react-icons'
import {useRef}    from 'react'
import Link        from 'next/link'
import Navigation  from '../../../components/Navigation'
import sampleImage from '../../../public/images/sample.jpg'
import * as Switch from '@radix-ui/react-switch'

export default function EditPortfolio({portfolio}) {
  const headlineRef    = useRef()
  const subheadlineRef = useRef()
  const [portfolioItems, setPortfolioItems] = useState(portfolio.portfolioItems)
  const [published, setPublished] = useState(portfolio.published)
  const { data: session } = useSession()

  async function updatePublished(checked) {
    fetch(`/api/portfolios/${portfolio.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        published: checked
      })
    }).then(res => {
      setPublished(checked)
      if (checked) {
        toast.success("Successfully published portfolio.")
      } else {
        toast.success("Successfully made portfolio private.")
      }
    }).catch(err => {
      toast("Failed to update portfolio. Please try again")
    })
  }

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
      toast.success("Successfully updated portfolio.")
    }).catch(err => {
      toast("Failed to update portfolio. Please try again")
    })
  }

  return (
    <>
      <Head>
        <title>Customize your portfolio | Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation session={session}/>
      <Container
        pb={4}
        as='main'>
        <Flex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'start'
          }}>
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
            <Box pt={4}>
              <Link
                href={`/portfolios/${portfolio.id}`}>
                <Button>
                  <Flex
                    sx={{
                      gap: 2,
                      alignItems: 'center'
                    }}>
                    <ExternalLinkIcon />
                    {published ? 'View live site' : 'Preview'}
                  </Flex>
                </Button>
              </Link>
            </Box>
          </Box>

          <Flex
            sx={{
              alignItems: 'center',
              gap: 1
            }}>
            <Label
              sx={{
                width: 'auto'
              }}
              pb={0}
              htmlFor='published'>
              Published
            </Label>
            <Switch.Root
              id="published"
              onCheckedChange={updatePublished}
              checked={published}
              sx={{
                all: 'unset',
                width: 42,
                height: 25,
                borderRadius: '9999px',
                bg: 'white',
                position: 'relative',
                WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                '&:focus': { boxShadow: `0 0 0 2px black` },
                '&[data-state="checked"]': { backgroundColor: 'gray' },
              }}>
              <Switch.Thumb
                sx={{
                  display: 'block',
                  width: 21,
                  height: 21,
                  backgroundColor: 'text',
                  borderRadius: '9999px',
                  transition: 'transform 100ms',
                  transform: 'translateX(2px)',
                  willChange: 'transform',
                  '&[data-state="checked"]': { transform: 'translateX(19px)' },
                }}
              />
            </Switch.Root>
          </Flex>
        </Flex>

        <Grid
          columns={[1, null, 2]}
          gap={3}>
          {portfolioItems &&
            <>
              {portfolioItems.map((item, idx) => {
                return (
                  <Card key={item.id} as='a' href={item.url}>
                    <Box
                      sx={{
                        borderRadius: '6px 6px 0 0',
                        overflow: 'hidden',
                        position: 'relative',
                        height: 200,
                        width: '100%'
                      }}>
                      <Image objectFit='cover' objectPosition='top' layout='fill' src={item.thumbnail} />
                    </Box>
                    <Box p={3}>
                      <Heading variant='cardTitle'>{item.title}</Heading>
                      <Text sx={{fontSize: 1}}>{item.description}</Text>
                    </Box>
                  </Card>
                )
              })}
            </>
          }
          <Link
            href={`/portfolios/${portfolio.id}/portfolio-items/new`}>
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
      </Container>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  const {id}    = ctx.query

  if (session) {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: id,
        user: {
          is: {
            email: session.user.email
          }
        }
      },
      include: {
        portfolioItems: true
      }
    })
    return {
      props: {
        portfolio: portfolio,
        session: session
      }
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
