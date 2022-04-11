import Link          from 'next/link'
import Image         from 'next/image'
import {
  Card,
  Box,
  Flex,
  Button,
  Heading,
  Text
} from 'theme-ui'
import {
  Pencil2Icon,
  Cross2Icon,
} from '@radix-ui/react-icons'
import {useSortable} from '@dnd-kit/sortable'
import {CSS}         from '@dnd-kit/utilities'

export default function PortfolioItem({id, item, portfolioId, deletePortfolioItem}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      sx={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}>
      <Box
        sx={{
          borderRadius: '6px 6px 0 0',
          overflow: 'hidden',
          position: 'relative',
          height: 200,
          width: '100%'
        }}>
        {item.thumbnail &&
          <>
            <Flex
              sx={{
                gap: 1,
                position: 'absolute',
                top: 0,
                right: 0,
                mr: 1,
                mt: 1,
                zIndex: 1
              }}>
              <Link
                href={`/portfolios/${portfolioId}/portfolio-items/${item.id}/edit`}>
                <Button
                  sx={{
                    p: 2
                  }}>
                  <Flex sx={{alignItems: 'center'}}><Pencil2Icon /></Flex>
                </Button>
              </Link>
              <Button
                sx={{
                  p: 2
                }}
                onClick={() => deletePortfolioItem(item.id)}>
                <Flex sx={{alignItems: 'center'}}><Cross2Icon /></Flex>
              </Button>
            </Flex>
            <a
              href={item.url}>
              <Image objectFit='cover' objectPosition='top' layout='fill' src={item.thumbnail} />
            </a>
          </>
        }
        {!item.thumbnail && item.url.includes('figma.com') &&
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
        }
        {!item.thumbnail && !item.url.includes('figma.com') &&
          <>
            <Flex
              sx={{
                gap: 1,
                position: 'absolute',
                top: 0,
                right: 0,
                mr: 1,
                mt: 1,
                zIndex: 1
              }}>
              <Link
                href={`/portfolios/${portfolioId}/portfolio-items/${item.id}/edit`}>
                <Button
                  sx={{
                    p: 2
                  }}>
                  <Flex sx={{alignItems: 'center'}}><Pencil2Icon /></Flex>
                </Button>
              </Link>
              <Button
                sx={{
                  p: 2
                }}
                onClick={() => deletePortfolioItem(item.id)}>
                <Flex sx={{alignItems: 'center'}}><Cross2Icon /></Flex>
              </Button>
            </Flex>
            <a href={item.url}>
              <Box
                sx={{
                  height: 200,
                  background: randomGradient()
                }}>
              </Box>
            </a>
          </>
        }
      </Box>
      <Box
        p={3}>
        <Heading variant='cardTitle'>{item.title}</Heading>
        <Text sx={{fontSize: 1}}>{item.description}</Text>
      </Box>
    </Card>
  )
}

