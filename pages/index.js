import Head from 'next/head'
import Image from 'next/image'
import {
  Button,
  Container,
  Flex,
  Box,
  Text,
  Grid,
  Heading
}           from 'theme-ui'
import {PlusIcon} from '@radix-ui/react-icons'

export default function Home() {
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
          <Box
            sx={{
              textAlign: 'center'
            }}
            pb={4}>
            <Heading
              pb={2}>
              Foliolio
            </Heading>
            <Text>
              Add a portfolio item below.
            </Text>
          </Box>
          <Grid
            columns={3}
            gap={3}>
            <Button
              variant='outline'>
              <PlusIcon />
            </Button>
            <Button
              variant='blankOutline'>
            </Button>
            <Button
              variant='blankOutline'>
            </Button>
          </Grid>
        </Flex>
      </Container>
    </>
  )
}
