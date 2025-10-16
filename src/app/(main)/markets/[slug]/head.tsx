import { getCoinByMint } from '@/utils/httpClient'

export default async function Head({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onlyfounders.fun'
  
  try {
    const coin = await getCoinByMint(params.slug)
    
    if (!coin) {
      return (
        <>
          <title>Token Not Found | OnlyFounders</title>
          <meta name="description" content="The requested token could not be found." />
        </>
      )
    }

    const title = `${coin.symbol} ${coin.price_per_token?.toFixed(6) || '0'} | OnlyFounders`
    const mcap = coin.usd_market_cap ? `${(coin.usd_market_cap / 1_000_000).toFixed(1)}M` : 'N/A'
    const description = `The live market cap of ${coin.name} today is ${mcap}.`
    const ogImageUrl = `${baseUrl}/api/tokens/${params.slug}/og`

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph */}
        <meta property="og:url" content={`${baseUrl}/markets/${params.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImageUrl} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={baseUrl.replace('https://', '')} />
        <meta property="twitter:url" content={`${baseUrl}/markets/${params.slug}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </>
    )
  } catch (error) {
    console.error('Error generating head metadata:', error)
    return (
      <>
        <title>OnlyFounders</title>
      </>
    )
  }
}