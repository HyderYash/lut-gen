"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Script from 'next/script'

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    
    // @ts-ignore
    window.gtag?.('config', measurementId, {
      page_path: url,
    })
  }, [pathname, searchParams, measurementId])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

export function pageview(GA_MEASUREMENT_ID: string, url: string) {
  // @ts-ignore
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

export function event(action: string, category: string, label: string, value?: number) {
  // @ts-ignore
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}