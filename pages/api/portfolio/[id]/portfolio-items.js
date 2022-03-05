import prisma from '../../../../lib/prisma'
import cloudinary from 'cloudinary'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb' // Set desired value here
    }
  }
}

export default async function handler(req, res) {
  const {id} = req.query
  const {method} = req
  const {
    title,
    description,
    url,
    thumbnail
  } = req.body

  let thumbnailURL
  await cloudinary.v2.uploader.upload(thumbnail, {}, function(err, res) {
    if (!err) {
      thumbnailURL = res.secure_url
    } else {
      console.log(err)
    }
  })

  switch (method) {
    case 'POST':
      const createPortfolioItem = await prisma.portfolioItem.create({
        data: {
          title:       title,
          description: description,
          url:         url,
          thumbnail:   thumbnailURL,
          portfolio: {
            connect: {
              id: id
            }
          }
        }
      })

      res.json({success: true})
      break
    default:
      res.status(405).end('Method not allowed')
  }
}

