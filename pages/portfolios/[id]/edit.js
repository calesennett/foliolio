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
  ExternalLinkIcon,
  Cross2Icon,
  Pencil2Icon
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
  const [thumbnail, setThumbnail] = useState(portfolio.thumbnail)

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        setThumbnail(reader.result)

        fetch(`/api/portfolios/${portfolio.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            thumbnail: reader.result
          })
        }).then(res => {
          if (res.ok) {
            toast.success('Updated portfolio thumbnail')
          } else {
            setThumbnail()
            toast.error('Failed to update thumbnail')
          }
        })
      }
      reader.readAsDataURL(file)
    })

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const { data: session } = useSession()

  async function deleteThumbnail() {
    const oldThumbnail = thumbnail

    setThumbnail()
    fetch(`/api/portfolios/${portfolio.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        thumbnail: null
      })
    }).then(res => {
      if (res.ok) {
        toast.success('Updated portfolio thumbnail')
      } else {
        setThumbnail(oldThumbnail)
        toast.error('Failed to update portfolio thumbnail')
      }
    })
  }

  async function deletePortfolioItem(id) {
    const oldPortfolioItems = portfolioItems

    const newPortfolioItems = portfolioItems.filter(i => {return i.id != id})
    setPortfolioItems(newPortfolioItems)

    fetch(`/api/portfolios/${portfolio.id}/portfolio-items/${id}`, {
      method: 'DELETE'
    }).then(res => {
      if (res.ok) {
        toast.success('Successfully deleted project.')
      } else {
        setPortfolioItems(oldPortfolioItems)
        toast.error('Failed to delete project.')
      }
    }).catch(err => {
      setPortfolioItems(oldPortfolioItems)
      toast.error('Something went wrong.')
    })
  }

  async function updatePublished(checked) {
    setPublished(checked)
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
      setPublished(!checked)
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
        subheadline: subheadlineRef.current.textContent,
        thumbnail: thumbnail
      })
    }).then(res => {
      if (res.ok) {
        toast.success("Successfully updated portfolio.")
      } else {
        toast.error("Failed to update portfolio. Please try again")
      }
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
        <Grid
          pb={2}
          sx={{
            justifyContent: 'end'
          }}>
          <Box>
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
        </Grid>
        <Grid
          columns={[1, '3fr 1fr']}
          gap={4}
          sx={{
            alignItems: 'start',
          }}>


          <Flex
            sx={{
              alignItems: 'start',
              gap: 4
            }}
            pb={4}>
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
                  boxShadow: 'default',
                  border: theme => `1px dashed ${theme.colors.gray}`
                }}>
                <Input {...getInputProps()} />
                <PlusIcon />
              </Box>
            ) : (
              <Flex
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: 9999,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'default',
                  '&:hover': {
                    button: {
                      visibility: 'visible',
                      opacity: 1
                    }
                  }
                }}>
                <Button
                  sx={{
                    p: 2,
                    bg: 'primary',
                    transition: 'all 0.15s ease-in-out',
                    '-webkit-transition': 'all 0.15s ease-in-out',
                    '-moz-transition': 'all 0.15s ease-in-out',
                    borderRadius: 6,
                    opacity: 0,
                    visibility: 'hidden',
                    zIndex: 1
                  }}
                  onClick={() => deleteThumbnail()}>
                  <Flex sx={{alignItems: 'center'}}><Cross2Icon /></Flex>
                </Button>
                <Image src={thumbnail} objectPosition='center' objectFit='cover' layout='fill' />
              </Flex>
            )}
            <Box>
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
            </Box>
          </Flex>

          <Flex
            sx={{
              pb: [3, 0],
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
        </Grid>

        <Grid
          columns={[1, null, 2]}
          gap={3}>
          {portfolioItems &&
            <>
              {portfolioItems.map((item, idx) => {
                return (
                  <Card
                    key={item.id}>
                    <Box
                      sx={{
                        borderRadius: '6px 6px 0 0',
                        overflow: 'hidden',
                        position: 'relative',
                        height: 200,
                        width: '100%'
                      }}>
                      {item.thumbnail &&
                        <>
                          <Flex
                            sx={{
                              gap: 1,
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              mr: 1,
                              mt: 1,
                              zIndex: 1
                            }}>
                            <Link
                              href={`/portfolios/${portfolio.id}/portfolio-items/${item.id}/edit`}>
                              <Button
                                sx={{
                                  p: 2
                                }}>
                                <Flex sx={{alignItems: 'center'}}><Pencil2Icon /></Flex>
                              </Button>
                            </Link>
                            <Button
                              sx={{
                                p: 2
                              }}
                              onclick={() => deleteportfolioitem(item.id)}>
                              <Flex sx={{alignItems: 'center'}}><Cross2Icon /></Flex>
                            </Button>
                          </Flex>
                          <a
                            href={item.url}>
                            <Image objectFit='cover' objectPosition='top' layout='fill' src={item.thumbnail} />
                          </a>
                        </>
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
                        <>
                          <Flex
                            sx={{
                              gap: 1,
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              mr: 1,
                              mt: 1,
                              zIndex: 1
                            }}>
                            <Link
                              href={`/portfolios/${portfolio.id}/portfolio-items/${item.id}/edit`}>
                              <Button
                                sx={{
                                  p: 2
                                }}>
                                <Flex sx={{alignItems: 'center'}}><Pencil2Icon /></Flex>
                              </Button>
                            </Link>
                            <Button
                              sx={{
                                p: 2
                              }}
                              onclick={() => deleteportfolioitem(item.id)}>
                              <Flex sx={{alignItems: 'center'}}><Cross2Icon /></Flex>
                            </Button>
                          </Flex>
                          <a href={item.url}>
                            <Box
                              sx={{
                                height: 200,
                                background: randomGradient()
                              }}>
                            </Box>
                          </a>
                        </>
                      }
                    </Box>
                    <a href={item.url}>
                      <Box
                        p={3}>
                        <Heading variant='cardTitle'>{item.title}</Heading>
                        <Text sx={{fontSize: 1}}>{item.description}</Text>
                      </Box>
                    </a>
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
