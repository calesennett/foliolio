import prisma from '../../../lib/prisma'
import {getSession} from 'next-auth/react'

export default async function handler(req, res) {
  const {id}     = req.query
  const {method} = req
  const session  = await getSession({req})

  const {
    headline,
    subheadline,
    published
  } = req.body

  switch (method) {
    case 'PATCH':
      if (session) {
        const updateUserPortfolio = await prisma.user.update({
          where: {
            email: session.user.email
          },
          data: {
            portfolios: {
              update: {
                where: {
                  id: id,
                },
                data: {
                  headline: headline,
                  subheadline: subheadline,
                  published: published
                }
              }
            }
          }
        })

        res.json(updateUserPortfolio)
      }
      break
    default:
      res.status(405).end('Method not allowed')
  }

}
