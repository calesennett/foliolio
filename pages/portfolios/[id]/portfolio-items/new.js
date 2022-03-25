/** @jsxImportSource theme-ui */

import prisma       from '../../../../lib/prisma'
import Head from 'next/head'
import Router from 'next/router'
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
  Image,
  Input,
  Label,
  Textarea,
  Themed
}           from 'theme-ui'
import {PlusIcon} from '@radix-ui/react-icons'
import Link       from 'next/link'
import React, {useCallback} from 'react'
import SquareLoader from 'react-spinners/SquareLoader'
import {
  Cross2Icon
} from '@radix-ui/react-icons'
import urlExist from 'url-exist'
import Navigation from '../../../../components/Navigation'
import {useDropzone} from 'react-dropzone'

export default function NewPortfolioItem({portfolio}) {
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [url, setUrl] = useState()
  const [screenshot, setScreenshot] = useState()
  const [screenshotLoading, setScreenshotLoading] = useState(false)
  const [iframeSrc, setiframeSrc] = useState()
  const [saving, setSaving] = useState(false)

  const captureScreenshot = async (url) => {
    if (url && !url.includes("figma.com") && !screenshot) {
      setScreenshotLoading(true)
      fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url
        })
      }).then(async (res) => {
        const data = await res.json()
        const screenshot = `data:image/jpeg;base64,${data.screenshot}`

        if (screenshot) {
          setScreenshot(screenshot)
        }

        setScreenshotLoading(false)
      })
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        setScreenshot(reader.result)
      }
      reader.readAsDataURL(file)
    })

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`/api/portfolios/${portfolio.id}/portfolio-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description,
          url: url,
          thumbnail: screenshot
        })
      })

      setSaving(false)
      await Router.push(`/portfolios/${portfolio.id}/edit`)
    } catch (err) {
      setSaving(false)
      console.error(err)
    }
  }

  const {data: session} = useSession()

  return (
    <>
      <Head>
        <title>Add a project | Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation session={session} />
      <Container
        as='main'>
        <form
          onSubmit={handleSubmit}>
          <Grid
            width='100%'
            gap={3}>
            <Heading
              variant='headline'>
              Project information
            </Heading>
            {!screenshot && !url?.includes("figma.com") &&
              <Flex
                {...getRootProps()}
                p={4}
                bg='transparent'
                sx={{
                  borderRadius: 6,
                  border: '1px dashed rgba(0,0,0,0.3)',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                <Input {...getInputProps()} />
                <PlusIcon />
                { isDragActive ?
                  <Text pl={2} sx={{fontSize: 1}}>Drop thumbnail</Text> :
                  <Text pl={2} sx={{fontSize: 1}}>Add thumbnail <span sx={{fontWeight: 'bold'}}>or</span> enter a URL to have one generated</Text>
                }
              </Flex>
            }

            {url?.includes("figma.com") &&
              <iframe
                height={400}
                width='100%'
                style={{
                  border: 0,
                  borderRadius: 6
                }}
                src={`https://www.figma.com/embed?embed_host=foliolio&url=${url}`}
                allowFullScreen
              />
            }

            <SquareLoader size={15} loading={screenshotLoading} />

            <Grid
              gap={3}
              columns={[1, null, 2]}>
              {screenshot &&
                <Box
                  sx={{
                    position: 'relative'
                  }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      mr: 1,
                      mt: 1,
                      bg: 'primary',
                      borderRadius: 6
                    }}>
                    <Button
                      sx={{
                        p: 2
                      }}
                      onClick={() => setScreenshot()}>
                      <Flex sx={{alignItems: 'center'}}><Cross2Icon /></Flex>
                    </Button>
                  </Box>
                  <Image src={screenshot} sx={{borderRadius: 6, maxWidth: '100%'}} />
                </Box>
              }
            </Grid>
            <Box>
              <Label
                htmlFor='url'>
                Website URL
              </Label>
              <Input value={url} onBlur={(e) => captureScreenshot(e.target.value)} onChange={e => setUrl(e.target.value)} id='url' name='url' placeholder='https://example.com' type='text' />
            </Box>
            <Box>
              <Label
                htmlFor='title'>
                Title
              </Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} id='title' name='title' placeholder='Project title' type='text' />
            </Box>
            <Box>
              <Label
                htmlFor='description'>
                Description
              </Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} id='description' name='description' placeholder='Project description' type='text' />
            </Box>
          </Grid>

          <Box py={4} sx={{float: 'right'}}>
            <Link
              href={`/portfolios/${portfolio.id}/edit`}>
              <Button mr={2} variant='secondary'>Cancel</Button>
            </Link>
            <Button type='submit'>{saving ? "Saving..." : "Save"}</Button>
          </Box>
        </form>
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
      }
    })

    return {
      props: {
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
