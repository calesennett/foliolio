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
  Textarea
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

      <Container>
        <Flex
          sx={{
            minHeight: '100vh',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          as='main'>
          <Grid
            gap={3}>
            <Box
              p={4}
              bg='lightgray'
              sx={{
                borderRadius: 6
              }}>
              <Text sx={{fontSize: 1}}>Add screenshot</Text>
            </Box>
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
        </Flex>
      </Container>
    </>
  )
}
