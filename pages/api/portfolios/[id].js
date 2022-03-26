import prisma from '../../../lib/prisma'
import {getSession} from 'next-auth/react'
import cloudinary from 'cloudinary'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
}

export default async function handler(req, res) {
  const {id}     = req.query
  const {method} = req
  const session  = await getSession({req})

  const {
    headline,
    subheadline,
    published,
    thumbnail
  } = req.body

  switch (method) {
    case 'PATCH':
      if (session) {
        let thumbnailURL
        if (thumbnail) {
          await cloudinary.v2.uploader.upload(thumbnail, {}, function(err, res) {
            if (!err) {
              thumbnailURL = res.secure_url
            } else {
              console.log(err)
            }
          })
        }

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
                  published: published,
                  ...(thumbnailURL) && {thumbnail: thumbnailURL}
                }
              }
            }
          }
        })

        res.json(updateUserPortfolio)
      }
      break
    case 'DELETE':
      if (session) {
        const deleteUserPortfolio = await prisma.user.update({
          where: {
            email: session.user.email
          },
          data: {
            portfolios: {
              delete: {
                id: id
              }
            }
          }
        })

        res.json(deleteUserPortfolio)
      }
      break
    default:
      res.status(405).end('Method not allowed')
  }

}
