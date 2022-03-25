/** @jsxImportSource theme-ui */

import Head from 'next/head'
import Image from 'next/image'
import {useState, useCallback, useRef} from 'react'
import {useSession, getSession} from 'next-auth/react'
import {useDropzone} from 'react-dropzone'
import {toast}                  from 'react-toastify'
import prisma from '../../../lib/prisma'
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
  Label,
  Input
} from 'theme-ui'
import {
  PlusIcon,
  FontRomanIcon,
  ExternalLinkIcon
} from '@radix-ui/react-icons'
import Link        from 'next/link'
import Navigation  from '../../../components/Navigation'
import sampleImage from '../../../public/images/sample.jpg'
import randomGradient    from '../../../components/Gradient'
import * as Switch from '@radix-ui/react-switch'

export default function EditPortfolio({portfolio}) {
  const headlineRef    = useRef()
  const subheadlineRef = useRef()
  const [portfolioItems, setPortfolioItems] = useState(portfolio.portfolioItems)
  const [published, setPublished] = useState(portfolio.published)
  const [thumbnail, setThumbnail] = useState()

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        setThumbnail(reader.result)
      }
      reader.readAsDataURL(file)
    })

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

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
            alignItems: 'start',
            gap: 4
          }}>

          {!thumbnail ? (
            <Box
              {...getRootProps()}
              sx={{
                width: 100,
                height: 100,
                borderRadius: 9999,
                bg: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary',
                cursor: 'pointer',
                border: theme => `1px dashed ${theme.colors.primary}`
              }}>
              <Input {...getInputProps()} />
              <PlusIcon />
            </Box>
          ) : (
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: 9999,
                position: 'relative',
                overflow: 'hidden'
              }}>
              <Image src={thumbnail} objectPosition='center' objectFit='cover' layout='fill' />
            </Box>
          )}

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
              <Flex
                ref={subheadlineRef}
                onBlur={() => updatePortfolio()}
                suppressContentEditableWarning={true}
                contentEditable={true}
                sx={{
                  alignItems: 'center',
                  gap: 2
                }}>
                <FontRomanIcon />
                <Text>{portfolio.subheadline}</Text>
              </Flex>
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
              ml: 'auto',
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
                      {item.thumbnail &&
                        <Image objectFit='cover' objectPosition='top' layout='fill' src={item.thumbnail} />
                      }
                      {!item.thumbnail && item.url.includes('figma.com') &&
                        <iframe
                          height={250}
                          width='100%'
                          style={{
                            border: 0,
                            borderRadius: 6
                          }}
                          src={`https://www.figma.com/embed?embed_host=foliolio&url=${item.url}`}
                          allowFullScreen
                        />
                      }
                      {!item.thumbnail && !item.url.includes('figma.com') &&
                        <Box
                          sx={{
                            height: 200,
                            background: randomGradient()
                          }}>
                        </Box>
                      }
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
