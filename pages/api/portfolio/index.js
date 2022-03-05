import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const {method} = req
  var result

  switch (method) {
    case 'GET':
      result = await prisma.portfolio.findFirst({
        include: {
          portfolioItems: true
        }
      })

      res.json(result)
      break
    default:
      res.status(405).end(`Method ${method} not allowed`)
  }
}
