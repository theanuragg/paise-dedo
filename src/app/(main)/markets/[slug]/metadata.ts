// // app/markets/[slug]/page.tsx
// import { getCoinByMint } from '@/utils/httpClient'
// import { Metadata } from 'next'

// type Props = {
//   params: { slug: string }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = params
  
//   try {
//     const coin = await getCoinByMint(slug)

//     if (!coin) {
//       return {
//         title: 'Token Not Found | OnlyFounders',
//         description: 'The requested token could not be found on OnlyFounders.',
//       }
//     }

//     const title = `${coin.name} (${coin.symbol}) | OnlyFounders`
//     const description = `Trade ${coin.name} (${coin.symbol}) on OnlyFounders. Current price: $${coin.price_per_token?.toFixed(6) || '0'} | Market Cap: $${(coin.usd_market_cap || 0).toLocaleString()}`

//     return {
//       title,
//       description,
//       openGraph: {
//         title,
//         description,
//         type: 'website',
//         url: `https://onlyfounders.fun/markets/${slug}`,
//         images: [
//           {
//             url: `https://onlyfounders.fun/markets/${slug}/opengraph-image`,
//             width: 1200,
//             height: 630,
//             alt: `${coin.name} (${coin.symbol}) token information`,
//           }
//         ],
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title,
//         description,
//         images: [`https://onlyfounders.fun/markets/${slug}/opengraph-image`],
//       },
//     }
//   } catch (error) {
//     console.error('Error generating metadata:', error)
//     return {
//       title: 'OnlyFounders',
//       description: 'Token trading platform',
//     }
//   }
// }

// // Your page component below
// export default async function TokenPage({ params }: Props) {
//   // Your existing page component code
//   const coin = await getCoinByMint(params.slug)
  
//   if (!coin) {
//     return <div>Token not found</div>
//   }

//   return (
//     <div>
//       {/* Your existing page content */}
//     </div>
//   )
// }