import Head from 'next/head'
import Image from 'next/image'
import {
  Button,
  Container,
  Flex,
  Box,
  Text,
  Grid,
  Heading,
  Input,
  Label,
  Textarea,
  Themed
}           from 'theme-ui'
import {PlusIcon} from '@radix-ui/react-icons'
import Link       from 'next/link'

export default function NewLinkPage() {
  return (
    <>
      <Head>
        <title>Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        as='main'>
        <Grid
          width='100%'
          gap={3}>
          <Heading
            variant='headline'>
            Project information
          </Heading>
          <Flex
            p={4}
            bg='transparent'
            sx={{
              borderRadius: 6,
              border: '1px dashed rgba(0,0,0,0.3)',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
            <PlusIcon />
            <Text pl={2} sx={{fontSize: 1}}>Add screenshots</Text>
          </Flex>
          <Box>
            <Label
              htmlFor='url'>
              Website URL
            </Label>
            <Input id='url' name='url' placeholder='https://example.com' type='text' />
          </Box>
          <Box>
            <Label
              htmlFor='title'>
              Title
            </Label>
            <Input id='title' name='title' placeholder='Project title' type='text' />
          </Box>
          <Box>
            <Label
              htmlFor='description'>
              Description
            </Label>
            <Textarea rows={5} id='description' name='description' placeholder='Project description' type='text' />
          </Box>
        </Grid>

        <Box py={4} sx={{float: 'right'}}>
          <Link
            href='/'>
            <Button mr={2} variant='secondary'>Cancel</Button>
          </Link>
          <Button>Save</Button>
        </Box>
      </Container>
    </>
  )
}
