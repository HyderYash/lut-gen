import React from 'react';

export function LUTBuilderStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'LUTBuilder.ai',
    'description': 'AI-Powered Color Grading & LUT Generation Platform',
    'url': 'https://lutbuilder.ai',
    'applicationCategory': 'Multimedia',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'potentialAction': {
      '@type': 'CreateAction',
      'object': {
        '@type': 'DigitalDocument',
        'name': 'Custom LUT Generation'
      }
    }
  }

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}