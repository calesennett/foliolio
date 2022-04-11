import prisma from '../../../../../lib/prisma'
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
  const session = await getSession({req})
  const {id, itemId} = req.query
  const {
    title,
    description,
    url,
    order,
    thumbnail
  } = req.body
  const {method}     = req

  if (!session) return res.status(401).end()

  switch (method) {
    case 'PATCH':
      let thumbnailURL = (thumbnail && thumbnail.includes('cloudinary.com')) ? thumbnail : null
      if (!thumbnailURL && !url.includes('figma.com')) {
        if (thumbnail && !thumbnail.includes('cloudinary.com')) {
          await cloudinary.v2.uploader.upload(thumbnail, {}, function(err, res) {
            if (!err) {
              thumbnailURL = res.secure_url
            } else {
              console.log(err)
            }
          })
        }
      }
      const updatePortfolioItem = await prisma.user.update({
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
                  update: {
                    where: {
                      id: itemId
                    },
                    data: {
                      title,
                      description,
                      url,
                      order,
                      thumbnail: thumbnailURL
                    }
                  }
                }
              }
            }
          }
        }
      })

      res.json(updatePortfolioItem)
      break
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
