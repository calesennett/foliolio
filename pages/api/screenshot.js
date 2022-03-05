import captureWebsite from 'capture-website'

export default async function handler(req, res) {
  const {url}          = req.body
  const screenshotData = await captureWebsite.base64(url, {
    type: 'jpeg'
  })

  res.json({screenshot: screenshotData})
}
