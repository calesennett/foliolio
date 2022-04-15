/** @jsxImportSource theme-ui */

import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect, useCallback, useRef} from 'react'
import {useSession, getSession} from 'next-auth/react'
import {useDropzone} from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import PortfolioItem       from '../../../components/PortfolioItem'
import {toast}             from 'react-toastify'
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
import * as Switch from '@radix-ui/react-switch'

export default function EditPortfolio({portfolio}) {
  const headlineRef    = useRef()
  const subheadlineRef = useRef()
  const [portfolioItems, setPortfolioItems] = useState(portfolio.portfolioItems)
  const [published, setPublished] = useState(portfolio.published)
  const [thumbnail, setThumbnail] = useState(portfolio.thumbnail)
  const [activeId,  setActiveId]  = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    } else {
      setPortfolioItemOrder()
    }
  }, [portfolioItems])

  const { data: session } = useSession()

	function handleDragEnd(event) {
    const {active, over} = event

    if (active.id !== over.id) {
      setPortfolioItems((portfolioItems) => {
        const oldIndex = portfolioItems.map(item => item.id).indexOf(active.id)
        const newIndex = portfolioItems.map(item => item.id).indexOf(over.id)

        return arrayMove(portfolioItems, oldIndex, newIndex);
      })
    }
  }

  async function setPortfolioItemOrder() {
    portfolioItems.forEach((item, idx) => {
      fetch(`/api/portfolios/${portfolio.id}/portfolio-items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order: idx,
          url: item.url,
          thumbnail: item.thumbnail
        })
      }).then(res => {
        if (res.ok) {
          toast.success('Reordered portfolio items')
        } else {
          toast.error('Failed to reorder items')
        }
      })
    })
  }

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


          <Grid
            columns={[1, '1fr 3fr', '1fr 4fr']}
            sx={{
              alignItems: 'start',
              gap: 4
            }}
            pb={4}>
            {!thumbnail ? (
              <Box
                {...getRootProps()}
                sx={{
                  mx: ['auto', 0],
                  width: 100,
                  height: 100,
                  borderRadius: 9999,
                  bg: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary',
                  cursor: 'pointer',
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
                  mx: ['auto', 0],
                  width: 100,
                  height: 100,
                  borderRadius: 9999,
                  position: 'relative',
                  overflow: 'hidden',
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
          </Grid>

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={portfolioItems}>
                {portfolioItems.map(item => <PortfolioItem deletePortfolioItem={deletePortfolioItem} id={item.id} key={item.id} item={item} portfolioId={portfolio.id} />)}
              </SortableContext>
            </DndContext>
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
        portfolioItems: {
          orderBy: {
            order: 'asc'
          }
        }
      },
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
