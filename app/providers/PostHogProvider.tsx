import type { ReactNode } from "react";

/**
 * Server Component wrapper. Checks NEXT_PUBLIC_POSTHOG_KEY at build
 * time — if absent, children pass through with zero PostHog JS.
 * When the key exists, dynamically imports the client provider so
 * posthog-js is never part of the initial server bundle.
 */
export async function PostHogProvider({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  const { PostHogProviderClient } = await import("./PostHogProviderClient");
  return <PostHogProviderClient>{children}</PostHogProviderClient>;
}
