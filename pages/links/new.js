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
import urlExist from 'url-exist'
import Navigation from '../../components/Navigation'
import {useDropzone} from 'react-dropzone'

export default function NewLinkPage() {
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [url, setUrl] = useState()
  const [screenshot, setScreenshot] = useState()
  const [screenshotLoading, setScreenshotLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const captureScreenshot = async (url) => {
    if (url) {
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
      await fetch('/api/portfolio/cl0bhoe900019avnyyyv8agb2/portfolio-items', {
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
      await Router.push('/')
    } catch (err) {
      setSaving(false)
      console.error(err)
    }
  }

  const {data: session} = useSession()

  return (
    <>
      <Head>
        <title>Foliolio</title>
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
            {!screenshot &&
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
                <PlusIcon />
                { isDragActive ?
                  <Text pl={2} sx={{fontSize: 1}}>Drop screenshots</Text> :
                  <Text pl={2} sx={{fontSize: 1}}>Add screenshots</Text>
                }
              </Flex>
            }

            <SquareLoader size={15} loading={screenshotLoading} />

            <Grid
              gap={3}
              columns={2}>
              {screenshot &&
                <Image src={screenshot} sx={{borderRadius: 6, maxWidth: '100%'}} />
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
              href='/'>
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
  return {
    props: {
      session: await getSession(ctx)
    }
  }
}
