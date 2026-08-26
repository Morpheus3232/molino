"use client";

import type { UserProfile } from "@/types/user";
import type { ReadingContext } from "@/lib/engines/intelligence/types";
import PremiumChatSection from "@/components/chat/PremiumChatSection";

interface ChatWithMolinoProps {
  profile: UserProfile;
  readingContext?: ReadingContext;
}

export default function ChatWithMolino({ profile, readingContext }: ChatWithMolinoProps) {
  return <PremiumChatSection profile={profile} readingContext={readingContext} />;
}
