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
  Themed
}           from 'theme-ui'
import {
  PlusIcon,
  MagicWandIcon
} from '@radix-ui/react-icons'
import Link       from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Foliolio</title>
        <meta name="description" content="quick portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        as='main'>
        <Box
          pb={4}>
          <Heading
            as='h1'
            pb={2}>
            <Flex sx={{alignItems: 'center'}}>
              Foliolio <MagicWandIcon style={{paddingLeft: 10}} width='auto' height={25} />
            </Flex>
          </Heading>
          <Text>
            Add a portfolio item below.
          </Text>
        </Box>
        <Grid
          columns={[1, null, 3]}
          gap={3}>
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
          <Button
            variant='blankOutline'>
          </Button>
          <Button
            variant='blankOutline'>
          </Button>

          <Button
            variant='blankOutline'>
          </Button>
          <Button
            variant='blankOutline'>
          </Button>
        </Grid>

        <Box py={4} sx={{float: 'right'}}>
          <Link
            href='/'>
            <Button mr={2} variant='secondary'>Save</Button>
          </Link>
          <Button>Publish</Button>
        </Box>
      </Container>
    </>
  )
}
