import {useSession, getSession} from 'next-auth/react'
import {
  Container
} from 'theme-ui'

export default function EditPage({portfolio}) {
  console.log(portfolio)
  return (
    <Container>
      Portfolio
    </Container>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  const {id}    = ctx.query

  if (session) {
    const portfolio = await prisma.portfolio.findMany({
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
        portfolio: portfolio
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
