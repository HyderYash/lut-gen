"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SearchParamsWrapperContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  return <>{children}</>
}

export default function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapperContent>{children}</SearchParamsWrapperContent>
    </Suspense>
  )
}