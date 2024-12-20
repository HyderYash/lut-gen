// app/components/JsonLd.tsx
export const JsonLd = () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'LUTBuilder.ai',
      url: 'https://www.lutbuilder.ai',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      description: 'Professional AI-powered color grading and LUT creation tool',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000'
      },
      creator: {
        '@type': 'Organization',
        name: 'LUTBuilder.ai',
        url: 'https://www.lutbuilder.ai'
      }
    }
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  }