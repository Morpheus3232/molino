# User Value Clarity Audit — Molino

**Audit date:** 2026-08-31
**Scope:** First-time journey HOME → MAPA → LECTURA → IA
**Audience:** First-time visitor, ~30 seconds of attention, no prior knowledge of numerology/astrology/Chinese zodiac
**Root feedback:** "No logré entender para qué sirve la información. Muchos datos pero no entendí jaja."

**Methodology:** Every finding below names specific files, current text/UI, why it confuses, and a proposed correction with a fix type (copy / hierarchy / interaction / product-structure). Findings are NOT rewrites — they are exact diagnosis points.

---

## Global findings (cross-cutting, not page-specific)

Before the page-by-page audit, these structural problems affect every step of the journey.

### GLOBAL-01 · Molino never answers "what are you?" in plain language

**Where it fails:** The `<title>` says "Tu Mapa Personal de Autoconocimiento" and the hero headline says "Tu fecha no es un dato. Es un patrón." — but nowhere in the visible above-the-fold content does Molino state what it actually *produces* for a human being. "Autoconocimiento" is abstract. "Patrón" is undefined. A first-timer leaves the hero knowing they entered a date but not knowing what they got or what it's for.

**Why it happens:** The brand chose a poetic identity ("mapa", "patrón", "volverse") over a functional one ("this tool shows you which countries, cities, brands, people, and movies resonate with your birth date"). Poetry builds brand; clarity builds retention. The product *does* produce a concrete, visual output — the Atlas-style entity grid — but that output is never promised up front.

**Current text:**
- `<title>`: "Tu Mapa Personal de Autoconocimiento"
- Hero h1: "Tu fecha no es un dato. Es un patrón."
- Hero subheadline: "Cada mapa es casi único: se construye desde tu fecha de nacimiento leída como un código de ocho dígitos."

**Proposed correction:** The hero subheadline should answer what the output *is* before the poetic framing. Something like: "Tu fecha cruza numerología, astrología y zodíaco chino para mostrarte con qué países, ciudades, marcas, personas y películas resuenas." The poetry stays — but after the user knows what they'll see.

**Fix type:** copy (hero subheadline) + hierarchy (move the output preview before the poetic claim)
**Severity:** High

---

### GLOBAL-02 · Jargon is deployed without any primer

The site uses a dense layer of domain terms on every page — Camino de Vida, Signo Solar, Animal Chino, Elemento, Modalidad, Polaridad, Número Maestro, Año Personal, Mes Personal, Día Personal, Convergencias, Tensiones, Afinidades, Lo Shu, etc. None of these are defined *before* first use on any page. The CalculationDetails section ("¿Cómo se calculó esto?") comes at the *bottom* of the map page, after the user has already scanned past everything else.

**Where it fails:** ProfileHub, ProfileCoordinatesSection, PersonalMapSection, BirthGridSection, ConvergenceSection — all assume the user already knows what these terms mean. The "¿Cómo se calculó esto?" accordion is the only glossary, and it's below the fold on the profile page.

**Why it happens:** The copy was written *for* people who already understand the system (or who trust it enough to not question it). A first-timer who doesn't know what "Camino de Vida" means has no on-ramp.

**Proposed correction:** A lightweight tooltip/popover system on the first encounter with each term, or a single "¿Qué significa cada cosa?" expandable primer at the top of the profile page, before the coordinates. Minimum viable: inline definitions on first use, like "Camino de Vida (la suma de los dígitos de tu fecha de nacimiento reducida a un número del 1 al 9)".

**Fix type:** interaction (tooltips) + copy (inline definitions)
**Severity:** High

---

### GLOBAL-03 · "El Mapa", "El Atlas", and "El Molino" are never differentiated

The product uses three distinct nouns that overlap confusingly:
- **El Mapa** = the user's personal birth-date reading (created in onboarding)
- **El Atlas** = the catalog of ~300 symbolic entities (countries, cities, brands, etc.) at `/atlas`
- **El Molino** = the AI chat layer

A first-timer who sees "Ver tu mapa", "Explorá el Atlas", and "Preguntale a tu Molino" has no framework for understanding these are different things with different purposes. The ThreeLevelsSection tries to address this but uses the same word "Mapa" for both the product and the specific output.

**Why it happens:** The naming evolved across sessions. "Mapa" was the original product name and was then applied to both the user's personal output and the overall product, creating a reflexive ambiguity.

**Proposed correction:** Establish a naming convention visible in the UI: "Tu mapa" (personal output) vs. "el Atlas" (entity catalog) vs. "la IA" (chat layer). The ThreeLevelsSection could use "Tu mapa → Tu lectura → Tu IA" with one-line descriptions of what each contains.

**Fix type:** product-structure (naming convention) + copy
**Severity:** Moderate

---

## HOME PAGE (app/page.tsx)

### HOME-01 · Hero headline doesn't answer "What does Molino do for me?"

**Where it fails:** `components/sections/HeroInstrument.tsx`, line 139-140

**Current text:**
```
Tu fecha no es un dato.
Es un patrón.
```

**The problem:** A first-time visitor who arrives at molino.app has no context for what a "patrón" is in this setting. The headline is emotionally evocative but functionally empty — it doesn't tell the user what they'll *see* or *get*. The subheadline is marginally better ("Cada mapa es casi único...") but still describes the *input* (date of birth), not the *output*.

**Why it happens:** The copy prioritizes brand voice ("Tu fecha no es un dato") over information architecture ("Aquí vas a ver: X, Y, Z"). The poetic framing assumes the user already knows what Molino is.

**Proposed correction:** Keep the h1 as-is but add a functional sub-headline before the date input that states the output concretely. Example: "Tu fecha cruza tres sistemas para mostrarte con qué países, ciudades, marcas y personas resuenas."

**Fix type:** copy
**Priority:** Critical

---

### HOME-02 · "Tres sistemas, una fecha" is ambiguous above the form

**Where it fails:** `components/sections/HeroInstrument.tsx`, line 130-133

**Current text:** The eyebrow above the date form reads "Tres sistemas, una fecha" framed by two horizontal rules.

**The problem:** "Tres sistemas" — which three? "Una fecha" — my date does what with them? A first-timer reads this and learns nothing actionable. The ClaritySection below names the three systems, but it comes *after* the form, meaning the user has already entered their date without understanding what they're getting into.

**Why it happens:** The eyebrow was designed as an aesthetic label, not as a functional primer. The three systems are explained in ClaritySection, but the information architecture puts the explanation after the commitment point (the form).

**Proposed correction:** Either (a) move ClaritySection before the hero form, or (b) expand the eyebrow to name the three systems: "Numerología · Astrología · Zodíaco Chino". Option (b) is lighter and keeps the current flow.

**Fix type:** hierarchy (reorder) or copy (expand eyebrow)
**Priority:** Critical

---

### HOME-03 · The CTA "Ver tu mapa" is meaningless before the user has a map

**Where it fails:** `components/sections/HeroInstrument.tsx`, line 187

**Current text:** The submit button says "Ver tu mapa" (View your map).

**The problem:** The user hasn't created a map yet. "Ver" (view) implies existence — but the map doesn't exist until they submit. This is like a "Buy now" button on a product page where you haven't selected anything yet. The button should say "Crear mi mapa" (Create my map) or "Generar mi mapa" (Generate my map), which is what it actually does.

Wait — looking more carefully, the button *does* trigger generation. The label "Ver tu mapa" is aspirational (what you'll get), but for a first-timer, "Ver" is confusing because they haven't created anything to view. The returning-user path correctly says "Ver mi mapa" because the map already exists. The new-user path should use a creation verb.

**Proposed correction:** Change the new-user button label from "Ver tu mapa" to "Generar mi mapa" or "Crear mi mapa". This matches the actual action and sets correct expectations.

**Fix type:** copy
**Priority:** High

---

### HOME-04 · Features section "Qué hacés con eso" assumes knowledge the user doesn't have

**Where it fails:** `components/sections/FeaturesSection.tsx`, line 56-57

**Current text:**
```
Qué hacés con eso
```
And the three cards: Hoy, Ciclos, Afinidades.

**The problem:** "Qué hacés con eso" — "eso" refers to what? The three systems? The map? A first-timer hasn't created anything and doesn't know what "eso" is. The three feature cards describe abstract capabilities:
- "Hoy" → "Qué número está activo hoy, y qué te pide." — This is a daily number they don't know how to use.
- "Ciclos" → "En qué ciclo estás y cuál es la próxima ventana que se abre." — "Ciclos" means nothing without context.
- "Afinidades" → "Con quién resonás por signo, y con qué parte del mundo." — Links to /pareja (couple mode), which is confusing for a single first-timer.

**Why it happens:** The section was written for users who already have a map and are looking for next steps. For a first-timer, it reads as a navigation menu to features they can't use yet.

**Proposed correction:** For the first-time journey, either (a) hide or soften this section until the user has created their map, or (b) reframe it as "Esto es lo que crea tu mapa" with concrete examples ("Hoy: el número que rige tu día", "Ciclos: en qué fase de tu año estás", "Afinidades: con qué países y marcas resuenas"). The heading should change contextually.

**Fix type:** interaction (conditional rendering) + copy
**Priority:** High

---

### HOME-05 · ArchetypeMarquee is completely opaque to a first-timer

**Where it fails:** `components/sections/ArchetypeMarquee.tsx`, lines 11-22

**Current text:** The scrolling marquee shows "TE AYUDAMOS A ENTENDER DE DONDE VIENE EL VIENTO · MOLINO.APP · CHEQUEEMOS DE DÓNDE VIENE EL VIENTO" repeating indefinitely.

**The problem:** "De donde viene el viento" is a poetic/philosophical phrase that means nothing in the context of a birth-date tool. A first-timer sees a decorative banner with text they can't connect to the product's function. The screen-reader text (line 78-79) hardcodes example entity names ("El Constructor, El Camaleón, Camino de Vida 4, Sol en Leo, Tigre") from a specific demo profile, which is misleading because it implies those are *the user's* results.

**Why it happens:** The marquee was designed as an atmospheric brand element, not as an informational element. For a returning user it's fine; for a first-timer it's noise.

**Proposed correction:** Either (a) replace the marquee content with functional text that describes what the site does on scroll ("Tu fecha cruza numerología, astrología y zodíaco chino para revelar tus afinidades con el mundo"), or (b) hide the marquee on first visit (detect via no cookie / no profile) and only show it to returning users who understand the product.

**Fix type:** interaction (conditional) + copy
**Priority:** Moderate

---

### HOME-06 · ProofSection shows demo data that a first-timer can't map to themselves

**Where it fails:** `components/sections/ProofSection.tsx`, lines 37-170

**Current text:** The "Cómo se calcula cada número" section shows a complete example for a specific profile (born 15/06/1990, Géminis, Caballo). The header says "Este es un ejemplo (no tu mapa todavía)."

**The problem:** Even though it says "example," a first-timer scrolling through this sees a full interactive display of numbers, badges, formulas, and meanings that don't apply to them. The "Ver detalles técnicos" toggle reveals arithmetic formulas like "15/06/1990 → 1+5+0+6+1+9+9+0 = 31 → 3+1 = 4" — a first-timer sees arithmetic they can verify but has no framework for what "4 = The Constructor" means. The section is impressive but alienating.

**Why it happens:** The ProofSection was designed to build trust through transparency, but it assumes the user understands the *output format* before seeing their own output. A demo of a format you don't understand doesn't build trust — it creates distance.

**Proposed correction:** Add a one-line primer before the demo: "Esto es un ejemplo de lo que ves cuando creas tu mapa" followed by a brief mapping (e.g., "Tu Camino de Vida es un número del 1 al 9 que describe tu energía fundamental"). Alternatively, show a simpler, more generic demo (just one system, one number, one meaning) rather than the full four-quadrant display.

**Fix type:** copy (add primer) + hierarchy (simplify demo)
**Priority:** Moderate

---

## MAPA PAGE (components/profile/)

### MAPA-01 · ProfileHub header overwhelms with unlabeled data

**Where it fails:** `components/profile/ProfileHub.tsx`, lines 112-121

**Current text:**
```
Camino de Vida 7 · El Investigador
Sol en Piscis
Caballo · Metal · Yang
```

**The problem:** Three large display headings stacked vertically, all in uppercase, all using domain-specific terminology. A first-timer sees:
- "Camino de Vida 7" — what is 7? Why does it matter?
- "El Investigador" — an archetype name from nowhere
- "Sol en Piscis" — astrological language they may not know
- "Caballo · Metal · Yang" — Chinese zodiac terminology

None of these are labeled with plain-language definitions. The user sees numbers and labels but has no context for what they mean or why they should care.

**Why it happens:** ProfileHub is designed as the "home screen" for someone who already created their map and understands the system. For a first-timer, it's the most data-dense, least explanatory screen in the entire journey.

**Proposed correction:** Add a toggle or a "¿Qué significa esto?" expandable section. At minimum, add inline tooltips/icons next to each term that show a plain-language definition on hover/focus: "Camino de Vida: la suma de los dígitos de tu fecha de nacimiento (ej: 1990 → 1+9+9+0=19 → 1+9=10 → 1+0=1)". Consider a "Primer vistazo" expandable at the top of the page.

**Fix type:** interaction (tooltips/expando) + copy (inline definitions)
**Priority:** Critical

---

### MAPA-02 · "COORDENADAS FUNDAMENTALES — LOS CUATRO PILARES" uses unexplained terminology

**Where it fails:** `components/profile/ProfileCoordinatesSection.tsx`, lines 62-74

**Current text:** The section header reads "LOS CUATRO PILARES DE TU MAPA" with the subtitle "Cada sistema calcula una coordenada exacta a partir de tu fecha de nacimiento."

**The problem:** "Cuatro pilares" implies four columns, but the first three are the three zodiac systems (numerology, astrology, Chinese zodiac) and the fourth is "Ciclos de Tiempo" (personal year/month/day). The term "pilares" is architectural/metaphysical jargon. The phrase "coordenada exacta" sounds precise but is actually poetic — these are calculated numbers with interpretive meanings, not GPS coordinates.

The four cards themselves use terms that are never defined:
- Card 01: "Arquetipo", "Esencia", "Números Maestros"
- Card 02: "Elemento", "Modalidad", "Arquetipo"
- Card 03: "Polaridad", "Tronco", "Amigos del ciclo" (三合), "Energía opuesta" (六冲)
- Card 04: "Año Personal", "Mes Personal", "Día Personal"

**Why it happens:** The section was written to convey gravitas and precision, but the terminology density creates a wall of unfamiliar concepts. The Chinese characters (三合, 六冲) are displayed prominently without explanation.

**Proposed correction:** Add a collapsible "Glosario rápido" or inline definitions. At minimum, the "Amigos del ciclo (三合 San He)" and "Energía opuesta (六冲 Liu Chong)" cards need a one-line explanation: "三合 San He: los tres signos más compatibles contigo" and "六冲 Liu Chong: el signo que puede generar tensiones". These terms appear in the CycleTable on PersonalMapSection too — define them *once*, early.

**Fix type:** copy (add definitions) + interaction (expandable glossary)
**Priority:** High

---

### MAPA-03 · PersonalMapSection "DÓNDE TU SIGNO TOCA EL MUNDO" is cryptic

**Where it fails:** `components/profile/PersonalMapSection.tsx`, lines 515-533

**Current text:**
```
DÓNDE TU SIGNO
TOCA EL MUNDO.
```
With body: "Sos Caballo de Metal. Ahora mirá el mundo con esa clave: cada país, ciudad, prenda, auto, universidad, club, persona y película del atlas también nació en algún año, y ese año le dio su propio signo. Cruzar tu signo con el de cada uno es todo el cálculo..."

**The problem:** The headline "DÓNDE TU SIGNO TOCA EL MUNDO" is metaphorical. "Tocar el mundo" means nothing literal. The explanation is long and dense — a first-timer reading this in 30 seconds will skim and retain nothing. The concept (your birth year's animal sign is matched against the birth year of every entity in the Atlas) is genuinely complex and takes multiple sentences to explain, but the first-timer encounters it before they have *any* framework for understanding it.

Additionally, the CycleTable that follows shows all 12 zodiac animals with labels "vos", "amigo", "enemigo" — a first-timer doesn't know why these categories exist or what they imply about the entities.

**Why it happens:** The concept is inherently complex (cross-referencing birth years across 300+ entities). The copy tries to explain it in one paragraph, but the reader has no scaffolding. The "vos/amigo/enemigo" categorization is also potentially alarming — "enemigo" (enemy) is a strong word for a zodiac relationship.

**Proposed correction:** Add a visual diagram or animation that shows: "Your birth year → your animal → we compare it to each entity's birth year → they fall into one of these categories." The CycleTable should have a header explaining: "Cada entidad del atlas nació en un año chino. Si tu año y el suyo están en la misma relación, caen en esta casilla." The "enemigo" label could be softened to "energía opuesta" (which the code already uses in some places).

**Fix type:** interaction (visual explanation) + copy (simplify + soften terminology)
**Priority:** High

---

### MAPA-04 · BirthGridSection (Tu Cuadro de Natal) is the most confusing screen on the site

**Where it fails:** `components/profile/BirthGridSection.tsx`, lines 42-186

**Current text:** The section is titled "TU CUADRO DE NACIMIENTO" and "LOS DÍGITOS DE TU FECHA." It shows the digits of the birth date (e.g., "1 9 9 0 0 6 1 5"), asks the user to count them in a Lo Shu grid, and then interprets the results with labels like "El 9 es el número de la humanidad universal" and "El 1 es el número de la individualidad."

**The problem:** This is the most obscure section on the entire site. A first-timer:
1. Sees "TU CUADRO DE NACIMIENTO" and expects an astrological birth chart — it's actually a digit-frequency grid
2. Sees digits and a 3×3 grid — doesn't know what a Lo Shu grid is
3. Sees "9 × 2" and "El 9 es el número de la humanidad universal" — this feels arbitrary and untrustworthy
4. The section comes near the top of the map page (before the user has contextualized the three systems)

The "getMissingReading" function returns interpretive meanings for each digit (1=individualidad, 2=pareja, 3=comunicación, etc.) that read as horoscope-style claims without evidence.

**Why it happens:** This section was ported from the old radar-based dimension system to a Lo Shu grid. The concept (digit frequency → meaning) is niche numerological practice that the site's general audience won't understand or trust without extensive framing.

**Proposed correction:** Move this section further down the page, after the user has understood the three systems. Add a clear primer: "En la numerología tradicional, los dígitos de tu fecha de nacimiento se cuentan en una cuadrícula llamada Lo Shu. Cada dígito tiene un significado simbólico." Consider making this an expandable/collapsible section by default rather than always-visible. Or consider removing it from the first-time flow entirely and surfacing it as a "deep dive" option.

**Fix type:** hierarchy (move/collapse) + copy (add primer)
**Priority:** High

---

### MAPA-05 · ConvergenceSection's "convergencias" and "diferencias" are abstract

**Where it fails:** `components/profile/ConvergenceSection.tsx`, lines 33-132

**Current text:** "DÓNDE COINCIDEN TUS SISTEMAS" with items like "Numerología × Astrología: ambas señalan...". The intro says "Cuando sistemas que se calculan por separado dan el mismo resultado, estas tradiciones lo leen como un patrón más marcado — no como una predicción."

**The problem:** "Convergencias" and "diferencias" are statistical/meta-language terms. A first-timer doesn't understand why they should care whether two systems "coincide" or "don't contradict." The subtitle "no es una predicción" is defensive — it preemptively dismisses the user's hopes rather than explaining what the output *is*.

**Why it happens:** The section was designed for users who understand the premise and want to see the evidence. For a first-timer, "your systems point to different places" is confusing because they don't know what the systems pointed to yet.

**Proposed correction:** Add a plain-language summary at the top: "Cuando dos de tus sistemas (numerología, astrología, zodíaco chino) apuntan al mismo resultado, eso es una convergencia — una señal más fuerte. Cuando apuntan a cosas distintas, no hay nada malo: simplemente significa que ese aspecto de tu vida no tiene una señal clara todavía." Make this the first thing the user reads, before the evidence list.

**Fix type:** copy (add plain-language summary)
**Priority:** Moderate

---

### MAPA-06 · "El enemigo" concept is alarming without context

**Where it fails:** `components/profile/ProfileCoordinatesSection.tsx`, lines 289-299; `components/profile/PersonalMapSection.tsx`, lines 371-383

**Current text:**
- CoordinatesSection: "Tu energía opuesta · 六冲" → "Oposición directa" → "Seis posiciones en el ciclo"
- PersonalMapSection: "Lo que conviene evitar (六冲)" with the heading in Chinese characters

**The problem:** "Enemigo" is the label used in the app code (KIND_SHORT["enemigo"] = "enemigo" in line 59 of PersonalMapSection.tsx). "Lo que conviene evitar" is a softer rendering. The Chinese characters 六冲 (Liu Chong) are prominently displayed without explanation. A first-timer sees "ENEMIGO" / "lo que conviene evitar" prominently and may feel unsettled — this is supposed to be a friendly self-knowledge tool, not a fortune-telling app that labels parts of your chart as "enemies."

**Why it happens:** The traditional Chinese zodiac relationship system genuinely uses these categories (San He = friends, Liu Chong = clash). But the English/Spanish translation "enemigo" carries aggressive connotations that the original Chinese concept doesn't. The codebase already uses "energía opuesta" in some places and "enemigo" in others — the inconsistency itself is confusing.

**Proposed correction:** Standardize on "energía opuesta" across the site (it already appears in ProfileCoordinatesSection). Add a one-line definition: "六冲 Liu Chong: una relación de tensión tradicional entre dos signos — no es enemistad, es una diferencia de energía que puede generar fricción." Remove the word "enemigo" from all user-facing text.

**Fix type:** copy (standardize terminology) + interaction (add definition)
**Priority:** Moderate

---

## LECTURA PAGE (app/lectura/)

### LECTURA-01 · "Lectura · 02 · Tu relación con el mundo" implies missing content

**Where it fails:** `app/lectura/LecturaClient.tsx`, line 90

**Current text:** `<p>Lectura · 02 · Tu relación con el mundo</p>`

**The problem:** "02" implies this is Chapter 2 of something. The user sees this but doesn't see a "01" anywhere prominent. It creates anxiety — "what did I miss?" — and curiosity about whether they're reading something incomplete. The "02" comes from the old section numbering and now reads as an error or missing content.

**Why it happens:** The numbering was inherited from the old Atlas structure where sections were numbered. In the reading flow, "02" has no visible antecedent.

**Proposed correction:** Remove the "02" numbering from the header. Replace with a plain description: "La lectura de tu mapa" or "Cómo se lee tu mapa." If numbering is needed for internal structure, it should be visible as a breadcrumb: "Mapa → Lectura" so the user knows where they are in the flow.

**Fix type:** copy
**Priority:** Moderate

---

### LECTURA-02 · BirthGridSection in reading is the same confusing content, repeated

**Where it fails:** `components/lectura/LecturaGratis.tsx` imports and renders `BirthGridSection` from `@/components/profile/BirthGridSection`

**Current text:** The same "TU CUADRO DE NACIMIENTO" / "LOS DÍGITOS DE TU FECHA" section that appears on the map page also appears in the reading page.

**The problem:** The user already saw this section on the map page. Now they see it again in a different context without any indication that it's the same content they've already seen. The repetition doesn't add value — it just means they're scrolling past the same confusing digit-frequency grid twice.

**Why it happens:** The BirthGridSection is shared between the profile page and the reading page because the calculation is deterministic and the pieces are reused for the premium reading. But from the user's perspective, they're seeing the same thing twice.

**Proposed correction:** Either (a) show a "ya viste esto" indicator or collapse it by default on the reading page, or (b) replace the repeated BirthGridSection on the reading page with new content (deeper analysis of the grid, comparisons with the map, etc.). At minimum, add a section header that connects it: "Revisá los dígitos de tu fecha (lo que ya viste en tu mapa)".

**Fix type:** hierarchy (avoid repetition) + copy (connect to prior content)
**Priority:** Moderate

---

### LECTURA-03 · The PremiumGate paywall disrupts with abstract value props

**Where it fails:** `app/lectura/LaLecturaExperience.tsx`, lines 157-182; `components/premium/PremiumPaywallContent.tsx`

**Current text:** The paywall header reads "LA CONVERSACIÓN ENTRE TUS SISTEMAS." The description says "Todo lo de arriba es tuyo y no se paga. Lo que sigue es la parte que cruza los tres sistemas en una sola lectura escrita para tu mapa."

**The problem:** "La conversación entre tus sistemas" is abstract. The user just read their map and their free reading — they don't understand what "la conversación" is or how it differs from what they just read. "Cruzar los tres sistemas en una sola lectura escrita" is functionally accurate but not motivating. The paywall comes after the user has invested time creating their map and reading the free content — it's a moment of maximum frustration.

**Why it happens:** The paywall copy was written to explain the premium value, but it uses the same abstract language as the rest of the site. It doesn't show a concrete example of what "the conversation" looks like.

**Proposed correction:** Add a concrete example before the paywall — a one-paragraph excerpt from a real Reading Pro output (anonymized) that shows the user what they'll get: "Así dice una Lectura Pro para alguien como vos: [concrete paragraph about their specific pattern]." The FeatureComparison table helps, but a concrete sample is more persuasive.

**Fix type:** copy (add concrete example) + hierarchy (move example before paywall)
**Priority:** High

---

### LECTURA-04 · LecturaGratis intro "Mi Mapa quedó con una sola pregunta" is confusing

**Where it fails:** `components/lectura/LecturaGratis.tsx`, line 13 (comment), and the content that follows

**Current text:** The comment says "Mi Mapa quedó con una sola pregunta ('¿dónde toca el mundo mi signo?'); acá vive la otra ('¿qué significa?')." But this framing is internal — the user doesn't see it. The BirthGridSection title "LOS DÍGITOS DE TU FECHA" and the ConvergenceSection "DONDE COINCIDEN TUS SISTEMAS" don't clearly signal "this is the part where we explain what your map means."

**The problem:** The reading page is structured as "your map asked questions, now here are the answers," but the user doesn't see that narrative arc. They just see sections with technical titles.

**Why it happens:** The editorial structure is sound internally but isn't communicated to the user. The "two movements" framing (PiezasLibres says "Hasta ahora viste las piezas por separado. Esta es la conversación") is in the code but not prominently displayed.

**Proposed correction:** Add a visible narrative header at the top of LecturaGratis: "Tu mapa te mostró las piezas. Ahora, ¿qué significan juntas?" This makes the implicit structure explicit and gives the user a reason to scroll.

**Fix type:** copy (add narrative header)
**Priority:** Moderate

---

## IA PAGE (app/ai/)

### IA-01 · "Preguntale a tu Molino" doesn't explain what the AI actually is

**Where it fails:** `app/ai/page.tsx`, lines 66-75

**Current text:**
```
Preguntale
a tu Molino.
```
Subtitle: "No es un chatbot: ya tiene tu mapa completo —patrones, convergencias entre sistemas, tensiones, reglas y lo que no se puede afirmar de vos— antes de que escribas."

**The problem:**
1. "No es un chatbot" — this is confusing because it IS a chatbot. The negation creates more confusion than it resolves. The user thinks "it's not a chatbot... so what is it?"
2. "Ya tiene tu mapa completo" — the user just created their map but may not have internalized all the content yet.
3. "Patrones, convergencias entre sistemas, tensiones, reglas y lo que no se puede afirmar de vos" — this is a list of abstract concepts a first-timer doesn't understand and doesn't need to know to use the AI.

**Why it happens:** The copy tries to differentiate the AI from generic chatbots, but the "not a chatbot" framing feels evasive. The detailed list of what the AI "knows" is more of a technical specification than a user benefit.

**Proposed correction:** Change the framing from "what it is NOT" to "what it DOES": "Hablá con tu mapa. Hacé preguntas sobre tu momento, tus decisiones o tu dirección, y la IA te responde usando lo que ya sabe de tus números y signos." Remove the jargon list and replace with benefit-oriented language: "No necesitas explicar tu contexto — ya tiene tu mapa."

**Fix type:** copy
**Priority:** High

---

### IA-02 · The example questions reveal a scope the user can't evaluate

**Where it fails:** `app/ai/page.tsx`, lines 17-22

**Current text:**
```
Estoy por cambiar de trabajo. ¿Qué de mi mapa conviene tener en cuenta?
¿Por qué me cuesta terminar lo que empiezo?
¿Este es un buen año para mudarme de ciudad?
Tengo una discusión repetida con alguien. ¿Qué dice mi mapa sobre cómo la encaro?
```

**The problem:** These are good questions, but a first-timer has no framework for *why* their birth-date-derived map would have anything to say about career changes, unfinished projects, relocation, or interpersonal conflicts. The connection between "I'm a Caballo de Metal" and "should I move cities?" is not explained. The user might think "this is just astrology horoscopes" and dismiss it, or they might think "this knows everything about me" and have unrealistic expectations.

**Why it happens:** The examples were chosen to show the AI's versatility, but they don't bridge the gap between the user's zodiac identity and their real-life questions. There's no explanatory text connecting "your map" to "your life decisions."

**Proposed correction:** Add a one-line explanation between the AI description and the examples: "Tu mapa contiene patrones de cómo tomas decisiones, cuándo actuar y qué te cuesta — no predice el futuro, sino que te da una perspectiva adicional." This sets expectations before the user sees the examples.

**Fix type:** copy (add expectation-setting text)
**Priority:** High

---

### IA-03 · "50 preguntas incluidas" creates anxiety about limits

**Where it fails:** `app/ai/page.tsx`, line 103

**Current text:** "La conversación con tu mapa forma parte de la Lectura Pro (pago único de 8 dólares, acceso permanente). Incluye 50 preguntas."

**The problem:** "50 preguntas" — why 50? What happens after 50? Does the conversation stop? Can I ask more? This number creates an arbitrary ceiling in the user's mind and shifts their focus from "what can I ask" to "how many questions do I have left." It also creates a sense of scarcity ("only 50!") that doesn't match the "permanent access" messaging.

**Why it happens:** The 50-question limit was likely chosen as a practical token amount for the AI API, but it's communicated as a feature rather than a constraint.

**Proposed correction:** Either (a) remove the specific number and say "incluye consultas ilimitadas durante tu acceso Pro" if that's actually true, or (b) frame it transparently: "Puedes hacer hasta 50 preguntas por cada mapa que crees — si necesitas más, podés crear un nuevo mapa con una fecha diferente." This reframes the limit as a feature of the system (each map is a one-time reading) rather than a constraint.

**Fix type:** copy (reframe the limit)
**Priority:** Moderate

---

### IA-04 · Non-premium users see a dead-end on the AI page

**Where it fails:** `app/ai/page.tsx`, lines 84-114

**Current text:** Non-premium users see a list of example questions, a "Ver la Lectura Pro →" CTA, and the text "La conversación con tu mapa forma parte de la Lectura Pro (pago único de 8 dólares, acceso permanente). Incluye 50 preguntas."

**The problem:** The user arrives at the AI page, sees example questions they can't ask, and is redirected to the reading page to pay. This is a dead-end — the AI page doesn't let them do anything. The experience says "here's what you could do if you pay" rather than "here's what you can do now." This is especially jarring because the home page and the map page don't clearly indicate that the AI is behind a paywall until the user reaches this page.

**Why it happens:** The paywall is implemented at the page level rather than progressively disclosed. The home page hints at "Preguntale" as a feature without clearly marking it as Pro-only until the user clicks through.

**Proposed correction:** Add a visual indicator earlier in the journey that the AI is a Pro feature. On the home page's ThreeLevelsSection, the "Preguntale" card already says "Pro" — but the hero and other pages don't mention the paywall at all. Consider adding a subtle "Requiere Lectura Pro" indicator on the ThreeLevelsSection card or a tooltip on the nav item.

**Fix type:** hierarchy (progressive disclosure) + copy (add indicators)
**Priority:** High

---

## Summary severity matrix

| Priority | Count | Findings |
|---|---|---|
| **Critical** | 4 | HOME-01, HOME-02, MAPA-01, IA-04 |
| **High** | 8 | HOME-03, HOME-04, MAPA-02, MAPA-03, MAPA-04, LECTURA-03, IA-01, IA-02 |
| **Moderate** | 8 | GLOBAL-01, GLOBAL-02, GLOBAL-03, HOME-05, HOME-06, MAPA-05, MAPA-06, LECTURA-01, LECTURA-02, LECTURA-04, IA-03 |

*(Note: some findings span multiple priorities — GLOBAL-01 and GLOBAL-02 are marked High as they affect every page, but could be argued as Critical since they're root causes.)*

---

## Fix-type distribution

| Fix Type | What It Means | Key Findings |
|---|---|---|
| **Copy** | Change the words — the product structure is fine, the messaging isn't | HOME-01, HOME-02, HOME-03, IA-01, IA-02, MAPA-02, LECTURA-01, IA-03 |
| **Hierarchy** | Change the order or visibility of sections — the content exists but is in the wrong place | HOME-02, HOME-04, HOME-05, MAPA-04, LECTURA-04 |
| **Interaction** | Add tooltips, expandables, conditionals — the content exists but needs to be surfaced differently | GLOBAL-02, MAPA-01, MAPA-03, MAPA-05, MAPA-06, LECTURA-02, HOME-04, IA-04 |
| **Product-structure** | Change the naming, sections, or flow — the architecture itself causes confusion | GLOBAL-03, MAPA-06 |

---

## Recommendation: fix order for maximum impact

1. **First sprint (Critical):** Fix HOME-01 (hero copy), HOME-02 (form eyebrow), MAPA-01 (profile header terms), IA-04 (progressive disclosure of paywall). These are the first things a new user sees and they determine whether the user stays or bounces.

2. **Second sprint (High):** Fix MAPA-02 (coordination terminology), MAPA-03 (map explanation), MAPA-04 (birth grid), IA-01 (AI framing), IA-02 (example context), LECTURA-03 (paywall value prop). These are the core experience screens.

3. **Third sprint (Moderate):** Fix the remaining copy, terminology, and hierarchy issues. These improve polish but won't cause user drop-off on their own.

4. **Ongoing:** The jargon primer (GLOBAL-02) and naming convention (GLOBAL-03) are cross-cutting infrastructure improvements that make all other fixes more effective. Consider these a foundational investment.

---

*End of audit. All findings are based on source code at `/Users/francoviegaslloverasgmail.com/molino` as of 2026-08-31. No code has been modified — this is a diagnostic document.*
