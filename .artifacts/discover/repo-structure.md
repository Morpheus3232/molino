# Repository Structure Discovery

## Overview

Molino is a Next.js 16.2.12 web application (React 19.2.8) with deterministic engines, no backend, no DB. Persistence via localStorage only.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.12 |
| React | React | 19.2.8 |
| Animation | Framer Motion | 11.18.2 |
| Styling | Tailwind CSS | — |
| Testing (unit) | Vitest | v4.1.10 |
| Testing (e2e) | Playwright | 1.62.1 |
| Deploy | Vercel | — |
| Storage | localStorage | — |

## Directory Structure

```
molino/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Homepage (HOME)
│   ├── timing/page.tsx      # Timing page
│   ├── decisions/page.tsx   # Decisions page
│   ├── hoy/page.tsx         # Daily energy
│   ├── profile/             # Profile onboarding/settings
│   ├── affinity/            # Chinese zodiac compatibility
│   ├── compatibility/       # Advanced compatibility
│   ├── onboarding/          # User profile setup
│   ├── conocimiento/        # Knowledge/content pages
│   ├── api/                 # API routes (optional AI)
│   └── sitemap.ts
├── components/
│   ├── layout/              # UniversityHeader, Footer, etc.
│   ├── ui/                  # Button, DateInput, MotionProvider
│   ├── sections/            # HeroNew, SystemsPreview, Journey, etc.
│   ├── hoy/HoyClient.tsx    # Daily guidance client
│   └── profile/             # ProfileTabs, etc.
├── lib/
│   ├── engines/             # 22 deterministic engines
│   │   ├── timingEngine.ts
│   │   ├── decisionsEngine.ts
│   │   ├── dailyEnergyEngine.ts
│   │   ├── affinityEngine.ts
│   │   ├── numerologyEngine.ts
│   │   ├── astrologyEngine.ts
│   │   └── ...
│   ├── calculations.ts      # Score calculations
│   ├── session/             # localStorage utilities
│   ├── utils/
│   │   ├── motion.ts        # Framer Motion variants
│   │   ├── premiumMotion.ts # Premium motion utilities
│   │   └── score.ts
│   └── data/                # Constants, navigation, archetypes
├── __tests__/               # Vitest unit tests (666 tests)
├── e2e/                     # Playwright e2e tests
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
└── agency-agents/           # Agent repository submodule
```

## Key Files for HOME Analysis

| File | Role |
|------|------|
| `app/page.tsx` | Home page main component |
| `components/sections/HeroNew.tsx` | Hero section |
| `components/sections/SystemsPreview.tsx` | Systems overview |
| `components/sections/Journey.tsx` | User journey |
| `components/sections/ToolsAndDiscovery.tsx` | Tools grid |
| `components/sections/ConceptsIndex.tsx` | Knowledge links |
| `components/sections/DecisionEntryPrompt.tsx` | Decision CTA |
| `lib/hooks/useProfile.ts` | Profile loading (localStorage) |
| `lib/utils/motion.ts` | Motion variants |
| `lib/utils/premiumMotion.ts` | Premium motion features |

## Critical Distinctions

- **AFFINITY**: Chinese zodiac only. entity → zodiac animal
- **COMPATIBILITY**: Can use multiple systems
- **Engines**: All deterministic, no AI required
- **AI**: Optional fallback only
