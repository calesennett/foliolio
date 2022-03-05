import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const {id} = req.query
  const {method} = req
  const {
    headline,
    subheadline
  } = req.body

  switch (method) {
    case 'PATCH':
      const updatePortfolio = await prisma.portfolio.update({
        where: {
          id: id
        },
        data: {
          headline: headline,
          subheadline: subheadline
        }
      })
      break
    default:
      res.status(405).end('Method not allowed')
  }

}
