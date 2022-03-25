import captureWebsite from 'capture-website'
import chromium       from 'chrome-aws-lambda'

export default async function handler(req, res) {
  const {url}          = req.body
  const screenshotData = await captureWebsite.base64(url, {
    type: 'jpeg',
    ...(process.env.NODE_ENV === 'production') && {launchOptions: {
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    }}
  })

  res.json({screenshot: screenshotData})
}
