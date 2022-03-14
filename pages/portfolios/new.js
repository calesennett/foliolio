import {
  getSession,
  useSession
} from 'next-auth/react'
import {useState} from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
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
} from 'theme-ui'

export default function NewPortfolioPage() {
  const {data: session} = useSession()
  const [headline, setHeadline] = useState()
  const [subheadline, setSubheadline] = useState()
  const [saving, setSaving]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch(`/api/portfolios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        headline: headline,
        subheadline: subheadline
      })
    })

    const data = await res.json()

    setSaving(false)
    await Router.push(`/portfolios/${data.id}/edit`)
  }

  return (
    <>
      <Head>
        <title>Create a portfolio | Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation session={session}/>

      <Container
        as='main'>
        <Heading pb={3} variant='headline'>New portfolio</Heading>
        <form
          onSubmit={handleSubmit}>
          <Grid
            width='100%'
            gap={3}>
            <Box>
              <Label
                htmlFor='headline'>
                Title
              </Label>
              <Input value={headline} onChange={e => setHeadline(e.target.value)} id='headline' name='headline' placeholder='My portfolio' type='text' />
            </Box>

            <Box>
              <Label
                htmlFor='description'>
                Description
              </Label>
              <Textarea value={subheadline} onChange={e => setSubheadline(e.target.value)} rows={5} id='subheadline' name='subheadline' placeholder='Tell the world about the purpose of this portfolio.' type='text' />
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
  const session = await getSession(ctx)

  if (session) {
    return {
      props: {
        session: session
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
