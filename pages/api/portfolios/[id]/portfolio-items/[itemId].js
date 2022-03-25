import prisma from '../../../../../lib/prisma'
import {getSession} from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({req})
  const {id, itemId} = req.query
  const {method}     = req

  switch (method) {
    case 'DELETE':
      if (session) {
        const deletePortfolioItem = await prisma.user.update({
          where: {
            email: session.user.email
          },
          data: {
            portfolios: {
              update: {
                where: {
                  id: id
                },
                data: {
                  portfolioItems: {
                    delete: {
                      id: itemId
                    }
                  }
                }
              }
            }
          }
        })

        res.json(deletePortfolioItem)
      }

      break
    default:
      res.status(403).end('Unauthorized')
  }
}
