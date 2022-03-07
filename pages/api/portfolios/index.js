import prisma from '../../../lib/prisma'
import {getSession} from 'next-auth/react'

export default async function handler(req, res) {
  const {method} = req
  const session = await getSession({req})

  console.log(session)

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
        break
      } else {
        res.status(422).json({message: 'unauthorized'})
      }
    default:
      res.status(405).end(`Method ${method} not allowed`)
  }
}
