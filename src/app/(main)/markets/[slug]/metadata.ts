import { getCoinByMint } from '@/utils/httpClient'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const coin = await getCoinByMint(params.slug)

  if (!coin) {
    return {
      title: 'Token Not Found | OnlyFounders',
      description: 'The requested token could not be found on OnlyFounders.',
    }
  }

  return {
    title: `${coin.name} (${coin.symbol}) | OnlyFounders`,
    description: `Trade ${coin.name} (${coin.symbol}) on OnlyFounders - The premier platform for token trading.`,
    openGraph: {
      title: `${coin.name} (${coin.symbol}) | OnlyFounders`,
      description: `Trade ${coin.name} (${coin.symbol}) on OnlyFounders - The premier platform for token trading.`,
      images: [`/markets/${params.slug}/opengraph-image`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${coin.name} (${coin.symbol}) | OnlyFounders`,
      description: `Trade ${coin.name} (${coin.symbol}) on OnlyFounders - The premier platform for token trading.`,
      images: [`/markets/${params.slug}/opengraph-image`],
    },
  }
}