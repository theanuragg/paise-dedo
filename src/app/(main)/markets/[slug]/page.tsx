// ============================================
// FILE 1: app/markets/[slug]/page.tsx (Server Component)
// ============================================
import { getCoinByMint } from '@/utils/httpClient'
import { Metadata } from 'next'
import ClientPage from './ClientPage'


export async function generateMetadata({ params }:any): Promise<Metadata> {
  const { slug } = params
  
  try {
    const coin = await getCoinByMint(slug)

    if (!coin) {
      return {
        title: 'Token Not Found | OnlyFounders',
        description: 'The requested token could not be found on OnlyFounders.',
      }
    }

    const title = `${coin.name} (${coin.symbol}) | OnlyFounders`
    const description = `Trade ${coin.name} (${coin.symbol}) on OnlyFounders. Current price: $${coin.price_per_token?.toFixed(6) || '0'}`
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onlyfounders.fun'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${baseUrl}/markets/${slug}`,
        images: [
          {
            url: `${baseUrl}/markets/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${coin.name} (${coin.symbol}) token information`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${baseUrl}/markets/${slug}/opengraph-image`],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'OnlyFounders',
      description: 'Token trading platform',
    }
  }
}

export default function ProjectDetailPage() {
  return <ClientPage  />
}