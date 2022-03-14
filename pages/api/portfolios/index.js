import prisma from '../../../lib/prisma'
import {getSession} from 'next-auth/react'

export default async function handler(req, res) {
  const {method} = req
  const session = await getSession({req})
  const {headline, subheadline} = req.body

  var result

  switch (method) {
    case 'GET':
      if (session) {
        result = await prisma.portfolio.findMany({
          include: {
            portfolioItems: true
          }
        })

        if (result) {
          res.json(result)
        } else {
          res.json({success: false, error: 'No portfolio found'})
        }
      } else {
        res.status(401).json({message: 'unauthorized'})
      }
      break
    case 'POST':
      if (session) {
        const createPortfolio = await prisma.portfolio.create({
          data: {
            headline: headline,
            subheadline: subheadline,
            user: {
              connect: {
                email: session.user.email
              }
            }
          }
        })

        res.json(createPortfolio)
      }
    default:
      res.status(405).end(`Method ${method} not allowed`)
  }
}
