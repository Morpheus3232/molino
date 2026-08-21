# Molino Homepage Redesign — Architecture & Philosophy

## Vision
Transform the homepage into a **power statement** that communicates capability, sophistication, and clarity in the first 3 seconds. Move from "trust us, we're transparent" to "look what you can see about yourself."

## Current Problems (User's perspective)
- Overcrowded (16 sections)
- Feels low-quality / generic SaaS
- Too much text, too many CTAs
- Doesn't **show** product power, only talks about it
- Conflicting messages (skeptic vs. believer)

## Design Principles (Redefined)

### 1. **First 3 seconds = Revelation**
- No explanation needed
- Visual hierarchy screams: "This is precise. This is real."
- One clear action: Enter your birth date

### 2. **Show, Don't Tell**
- Actual product visualization (not mockup)
- Real data flowing
- Dynamic, animated, alive
- But never flashy or cheap

### 3. **Simplicity in Depth**
- Reduce sections from 16 to 6-7
- Each section answers ONE question
- Ruthlessly eliminate repetition

### 4. **Differentiation Through Architecture**
- Not "we're transparent" (everyone says that)
- But: "Here's your exact calculations in real-time" (show the math)
- Not "100% private" (state it once, move on)
- But: "No servers, no tracking, no BS" (architectural choice visible in UI)

### 5. **For the Skeptic, Not the Believer**
- Remove emoji, mystical language, spiritual framing
- Emphasize: structure, logic, pattern, verifiable
- Language: "Personal data analysis" not "spiritual reading"
- Visual: Clean, technical, editorial — not astrological

---

## New Section Architecture (7 sections vs 16)

### 1. **HERO — The Instrument**
- **What**: Interactive date entry → instant calculation
- **Flow**: 
  - Returning user: "Your map is ready" (ghost button to profile)
  - New visitor: Full instrument (date picker) + one gold CTA
- **Visual**: The number of the day (big, animated) + micro insights (moon phase, element color) beneath
- **Tone**: "Enter your birth date. See what emerges."
- **No text walls**, no explanations here

### 2. **PROOF — Show, Don't Tell**
- **What**: A real personal map visualization (anonymized demo)
- **Flow**: 
  1. Four quadrants: Numerology | Astrology | Chinese Zodiac | Timeline
  2. Each quadrant shows actual data (numbers, symbols, dates)
  3. Hover/click reveals formula (transparency)
  4. Optional: "How is this calculated?" expandable
- **Visual**: Clean data dashboard aesthetic (not fortune-teller)
- **CTA**: "Enter your date to see your full map"

### 3. **CLARITY — Why This Matters**
- **What**: Three concrete use-cases
- **Structure**: 
  - Card 1: "Understand Your Pattern" (self-knowledge)
  - Card 2: "Make Decisions With Context" (actionable insight)
  - Card 3: "Navigate Your Cycles" (temporal awareness)
- **Each card**: Icon + headline + 1-2 sentence description + "Explore" link
- **No comparison tables**, no "vs. astrology" — just show value
- **Tone**: Professional, direct, outcome-focused

### 4. **CASE STUDIES — Credibility Without Mysticism**
- **What**: 3-4 real examples (anonymized)
- **Structure**: 
  - Person: "Sarah, 32, Entrepreneur"
  - Pattern: "Numerology Path 7 — Analysis & Intuition"
  - Outcome: "Used cycle timing to launch her company in optimal window"
- **Visual**: Simple card with age, role, outcome
- **No celebrity gossip**, no "spiritual transformation" narrative
- **Tone**: Business-focused, data-driven

### 5. **FEATURES — What's Inside**
- **What**: 6 key capabilities (no more)
- **Structure**: 
  1. Daily Energy (personalized to your cycles)
  2. Journal (track patterns over time)
  3. Compatibility (understand relationships via data)
  4. Timing (optimal windows for decisions)
  5. Atlas (affinity matching)
  6. Export (take your data anywhere)
- **Visual**: Icon + headline + one-liner (no paragraphs)
- **CTA**: All link to their respective pages or `/profile` if authenticated

### 6. **TRUST LAYER — Architecture & Privacy**
- **What**: Technical differentiators (stated once, clearly)
- **Structure**:
  - "100% Calculated Locally" — your browser does the math
  - "Never Stored on Servers" — unless you choose Premium
  - "Open Source" — audit it yourself
  - "One-Time Payment" — no subscriptions, no tracking
- **Visual**: 4 simple icons + one-liner each
- **Tone**: Matter-of-fact, technical
- **No badges, no emojis, no repetition from other sections**

### 7. **FINAL CTA — Path Forward**
- **What**: Simple next step
- **Structure**: 
  - Headline: "Ready to see your pattern?"
  - Subhead: "Takes 30 seconds"
  - Gold CTA: "Generate Your Map"
- **Visual**: Minimal, centered, elegant
- **Alternative for returning users**: "Welcome back, [Name]" + shortcuts to profile sections

---

## Visual Language

### Color
- **Foreground**: Keep warm editorial palette (`ink` #241F17, `paper` #F5F0E4, `accent` #9A4A18)
- **BUT**: Use it with extreme restraint
- **New approach**: 
  - Backgrounds: Mostly `paper` (light), occasional strategic `ink/5` for breathing room
  - Typography: `ink` (text), `accent` for emphasis (1-2 words max per section)
  - CTAs: Gold (#F5B022) only — no other colors
  - Data visualization: Monochromatic (greys/blacks) with single accent color per chart

### Typography
- **Kill the uppercase cascade** — use sentence case
- **Headline hierarchy**:
  - Section title: 28-32px, `font-heading`, uppercase only for section overline (eyebrow)
  - Body: 16px, `font-sans`, 1.6 line-height
  - Data/numbers: `font-mono`, 14-18px, aligned right or centered
- **Remove emoji entirely**
- **Preserve serif `font-display` for large numbers only** (day of month, personal year, etc.)

### Spacing & Structure
- **Max-width**: 1200px (slightly narrower for focus)
- **Section padding**: 6rem top/bottom (breathe)
- **Card padding**: 2rem (consistent)
- **Gutter**: 1.5rem (consistent)
- **Gap between sections**: Full-bleed divider (1px border, or -5% tint) OR white space only

### Motion
- **No scroll-reveal eyecandy** (kill `fadeUp` / `staggerItem` on every element)
- **Preserve motion only for**:
  - Hero number counting up on load (once, 1.5s)
  - Data tabs switching (smooth 200ms)
  - CTA hover state (gold glow, subtle)
- **Rationale**: Sophistication ≠ animation ≠ flashiness. Motion should serve clarity, not distract.

### Interactivity
- **Hero date input**: Segment fields (DD / MM / YYYY), live validation, clear error states
- **Proof section**: Tab interface (hover/click to switch quadrant)
- **Case study cards**: Minimal hover (slight lift, shadow enhance)
- **All CTAs**: Gold with accent color glow on hover, pointer feedback

---

## Copy Tone Shift

### Before
"Una plataforma educativa de código abierto que explora sistemas simbólicos..."
"Sin registro, sin cookies, sin tracking invasivo"
"No es magia, es estructura"

### After
"See your pattern. Understand your cycles. Make better decisions."
(Hero eyebrow: "Personal data analysis — 100% local")

"What emerges when you enter your birth date."
(Proof section intro)

"Whether you're an entrepreneur, parent, or decision-maker..."
(Clarity section)

"Open source. Always. Audit the math."
(Trust layer)

---

## Technical Approach

### Components to Build/Rewrite
1. **HeroInstrument.tsx** — Simplify, add day-number animation
2. **ProofSection.tsx** — NEW: Interactive demo visualization
3. **ClaritySection.tsx** — Rewrite: Remove table, make 3 simple cards
4. **CaseStudiesSection.tsx** — Rewrite: Anonymize, focus on outcome
5. **FeaturesSection.tsx** — NEW: 6 simple cards, no descriptions
6. **TrustLayer.tsx** — Consolidate from TrustSignals + FAQ
7. **CTASection.tsx** — Simplify from CTAFinal

### Sections to Remove/Combine
- ❌ TodayNumberBanner (integrate day-number into hero)
- ❌ SocialProofSection (move stats into Trust Layer or eliminate)
- ❌ UseCasesSection (superseded by Clarity + Features)
- ❌ NewInsightsTeaser (feature cards in Features section)
- ❌ PersonalizedHomeClient (move logic into hero return-state)
- ❌ MapPreviewDemo (merge into Proof section)
- ❌ ParejaTeaser (link from Features, not homepage)
- ❌ PremiumTeaser (link from Trust Layer or dedicated `/premium` page)
- ❌ AtlasTeaser (link from Features)
- ❌ QuienHaceEsto (move to `/nosotros` or remove)
- ❌ FAQ (move to dedicated `/faq` or embed in sections as accordion)
- ✅ **Consolidate to**: Hero → Proof → Clarity → CaseStudies → Features → Trust → CTA

---

## Metrics for Success

1. **First impression (0-3s)**: Visitor sees dynamic day-number, date input, one clear CTA. No choice paralysis.
2. **Clarity at scroll (3-10s)**: Visitor understands "this calculates real patterns based on birth data" + sees a real example.
3. **Confidence (10-30s)**: Visitor knows use-case applies to them + understands privacy model + ready to enter date.
4. **Conversion**: Reduce bounce rate, increase onboarding start rate (from cold homepage visits).

---

## Next Steps

1. **Design system refinement**: Nail color/typography/spacing (CSS)
2. **Component-by-component build**: Hero → Proof → Clarity → CaseStudies → Features → Trust → CTA
3. **Integrate with existing `/onboarding`, `/profile` flows** (no backend changes)
4. **Test on mobile** (ensure readable, not overwhelming)
5. **Accessibility pass**: WCAG 2.1 AA minimum
6. **Performance**: Lazy-load sections, keep LCP <2.5s
