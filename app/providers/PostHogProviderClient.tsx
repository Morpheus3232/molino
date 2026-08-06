'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense, useState } from 'react'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    if (pathname && ph) {
      let url = window.location.origin + pathname
      const search = searchParams.toString()
      if (search) url += '?' + search
      ph.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, ph])

  return null
}

function usePostHog() {
  const [posthog, setPosthog] = useState<any>(null)

  useEffect(() => {
    import('posthog-js').then((mod) => {
      setPosthog(mod.default)
    })
  }, [])

  return posthog
}

export function PostHogProviderClient({ children }: { children: React.ReactNode }) {
  const [posthogClient, setPosthogClient] = useState<any>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (key) {
      import('posthog-js').then((mod) => {
        const posthog = mod.default
        posthog.init(key, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
          cookieless_mode: 'always',
          capture_pageview: false,
          capture_pageleave: true,
          autocapture: false,
        })
        setPosthogClient(posthog)
      })
    }
  }, [])

  return (
    <PHProvider client={posthogClient}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
