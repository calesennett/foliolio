import Image from 'next/image'
import {
  Grid,
  Card,
  Box,
  Heading,
  Text
} from 'theme-ui'
import randomGradient from '../Gradient'

export default function PortfolioItems({items, bg}) {
  return (
    <Grid
      columns={[1, null, 2]}
      gap={3}>
      {items &&
        <>
          {items.map((item, idx) => {
            return (
              <Card key={item.id} as='a' href={item.url}>
                <Box
                  sx={{
                    borderRadius: '6px 6px 0 0',
                    overflow: 'hidden',
                    position: 'relative',
                    height: 200,
                    width: '100%'
                  }}>
                  {item.thumbnail &&
                    <Image objectFit='cover' objectPosition='top' layout='fill' src={item.thumbnail} />
                  }
                  {!item.thumbnail && item.url.includes('figma.com') && (
                    <iframe
                      height={250}
                      width='100%'
                      style={{
                        border: 0,
                        borderRadius: 6
                      }}
                      src={`https://www.figma.com/embed?embed_host=foliolio&url=${item.url}`}
                      allowFullScreen
                    />
                  )}
                  {!item.thumbnail && !item.url.includes('figma.com') &&
                    <Box
                      sx={{
                        height: 250,
                        width: '100%',
                        background: randomGradient()
                      }}>
                    </Box>
                  }
                </Box>
                <Box p={3}>
                  <Heading variant='cardTitle'>{item.title}</Heading>
                  <Text sx={{fontSize: 1}}>{item.description}</Text>
                </Box>
              </Card>
            )
          })}
        </>
      }
    </Grid>
  )
}

export function getInitialProps(ctx) {
  return {
    props: {
      bg: rv.linear_random()
    }
  }
}
