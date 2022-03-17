import {signIn, signOut} from 'next-auth/react'
import Link from 'next/link'
import {
  Flex,
  Text,
  Container,
  Button,
  Box,
  Heading
} from 'theme-ui'
import {
  DashboardIcon
} from '@radix-ui/react-icons'

export default function Navigation({session, bg, portfolio}) {
  return (
    <Container>
      <Flex
        py={4}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'start'
        }}>
        <Link href="/">
          <a>
            <Flex
              sx={{
                alignItems: 'center',
                gap: 2
              }}>
              <DashboardIcon width={20} height='auto' />
              <Heading
                as='h2'>
                Foli<Text color='transparent' sx={{'-webkit-text-stroke': '1px black'}}>oli</Text>o
              </Heading>
            </Flex>
          </a>
        </Link>
        {!portfolio &&
          <>
            {session ? (
              <Button onClick={() => signOut()}>Sign out</Button>
            ) : (
              <Button onClick={() => signIn()}>Sign in</Button>
            )}
          </>
        }
      </Flex>
    </Container>
  )
}
