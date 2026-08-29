# GitHub Description Audit — Molino

## Estado actual

### Descripción GitHub Repository (la que aparece en la tarjeta)
```
Tu mapa personal de autoconocimiento. Numerología, astrología, ciclos y arquetipos.
```

**Problemas identificados:**
- Muy genérica, no diferencia Molino de otras apps de astrología/numerología
- No comunica el diferenciador clave: **transparencia + privacidad radical**
- Omite "código abierto" y "educativo"
- Parece marketing, no propósito real del producto

---

## Análisis de coherencia filosófica

### Molino (Actual en README.md — línea 15)
```
"una plataforma educativa de código abierto que explora sistemas simbólicos 
(numerología pitagórica, astrología, zodíaco chino/ciclo sexagenario) con total 
transparencia y privacidad. Sin registro, sin cookies, sin tracking invasivo."
```
✅ **Honesto:** dice qué es y por qué es diferente.
✅ **Específico:** menciona sistemas concretos.
✅ **Valores:** transparencia, privacidad, código abierto.

### VersionLimitada (Actual en README.md — línea 5-6)
```
"una máquina que descubre problemas reales, reúne evidencia, 
formula hipótesis, ejecuta experimentos y toma decisiones `build / iterate / kill`."
```
✅ **Honesto:** describe el método, no la visión de marketing.
✅ **Específico:** enumera etapas del proceso.
✅ **Realista:** no promete éxito, describe el mecanismo.

### Molino iOS (Actual en README.md — línea 3-5)
```
"A standalone, navigable prototype of what Molino feels like as an installed
iOS app rather than a website. **Independent of the Molino production repo.**"
```
✅ **Honesto:** admite que es prototype, no producto final.
✅ **Específico:** explica scope y separación.

### Open-Generative-AI (Actual en README.md — línea 6)
```
"The free, open-source alternative to AI Video Platforms. Generate AI images 
and videos using 200+ state-of-the-art models — no content filters, no closed 
ecosystem, no subscription fees."
```
⚠️ **Problema:** Enfoque en "alternativa a", no en el valor real.
⚠️ **Superficial:** lista features (200+ models) sin propósito.

---

## Criterio filosófico coherente

Todos los proyectos del laboratorio comparten:

1. **Honestidad sobre ilusión**
   - Describe qué es realmente, no qué te gustaría que fuera
   - No exagera capacidades
   - Admite limitaciones (ej: Molino iOS es prototype)

2. **Método antes que outcome**
   - VersionLimitada describe su proceso (problema → hipótesis → experimento)
   - Molino describe su arquitectura (100% local, transparent engines)
   - NO promete resultados, describe cómo funciona

3. **Especificidad honesta**
   - Nombres de sistemas concretos (no "astrología genérica")
   - Tecnologías reales (Next.js 15, TypeScript)
   - Limitaciones claras (localStorage solo, no backend)

4. **Diferenciador real, no marketing**
   - Molino: transparencia radical + privacidad
   - VersionLimitada: método científico de validación de ideas
   - Molino iOS: prototipo navegable independiente

---

## Recomendaciones

### 1. Descripción GitHub Repository (Short description)

**Actual:**
```
Tu mapa personal de autoconocimiento. Numerología, astrología, ciclos y arquetipos.
```

**Propuesta (honesta, específica, diferenciadora):**
```
Open-source personal symbol map — numerology, astrology, Chinese zodiac 
with radical transparency & privacy. 100% client-side, no registration.
```

O si prefieres en español:
```
Mapa personal de autoconocimiento — Numerología, astrología, zodiaco chino.
Código abierto, transparente, 100% privacidad. Sin registro, sin tracking.
```

**Por qué:**
- Menciona "código abierto" (diferenciador real)
- Enfatiza "transparencia & privacidad" (el verdadero valor)
- Clarifica "100% client-side" (arquitectura honesta)
- Omite "sin registro" porque es obvio en privacidad radical

---

### 2. README.md — Philosophy Section (línea 13-23)

**Actual:**
```
## Filosofía

Molino es una plataforma educativa de código abierto que explora sistemas simbólicos 
(numerología pitagórica, astrología, zodíaco chino/ciclo sexagenario) con total 
transparencia y privacidad. Sin registro, sin cookies, sin tracking invasivo.

### Principios
- 📚 **Conocimiento libre**: Todo el contenido se basa en fuentes públicas.
- 🔒 **Privacidad radical**: Tu mapa gratuito se procesa 100% localmente...
```

**Propuesta (simplificada, más honesta):**
```
## Philosophy

Molino generates a personal "symbol map" — your numerological path, 
astrological chart, and Chinese zodiac cycle — from your birth date. 
Everything runs 100% locally; no registration, no backend persistence, 
no tracking. The calculation engine is transparent: every number has 
its formula and source visible.

### Core commitments
- **Open source**: Code is MIT. All calculations are verifiable.
- **Radical privacy**: Your map lives in browser localStorage only. 
  No registration, no cookies, no fingerprinting.
- **Transparency over mystique**: Every formula is explained; 
  each result shows its source and calculation.
- **For the curious, not the initiated**: Designed for people 
  discovering numerology/astrology for the first time, not advanced practitioners.
```

**Por qué:**
- Abre con el propósito real (qué genera, no qué es)
- Explica arquitectura honestamente (100% local)
- Diferencia de apps comerciales (no persistence, no tracking)
- Humaniza el approach (para el curioso, no iniciados)

---

### 3. package.json — description field

**Actual:** (vacío o no visible)

**Propuesta:**
```json
"description": "Open-source personal symbol map combining numerology, astrology, and Chinese zodiac. Transparent calculations, radical privacy, 100% client-side.",
```

---

## Aplicación a otros proyectos (para coherencia futura)

### VersionLimitada

**Actual:**
```
versionlimitada es una máquina que descubre problemas reales...
```

**Propuesta (si fuera a reescribirse):**
Mantener el actual — es ya muy honesto y específico.

### Molino iOS

**Actual:**
```
A standalone, navigable prototype...
```

**Propuesta:**
```
Molino as a native iOS app — a navigable prototype showing 
what the symbol map feels like installed, separate from the 
production web repo. Not a product; a design exploration.
```

---

## Resumen: Criterio unificado

| Elemento | Criterio | Molino | VersionLimitada | Molino iOS |
|----------|----------|--------|-----------------|-----------|
| **Honestidad** | Describe realidad, no aspiración | ✅ Mejorable | ✅ Bueno | ✅ Bueno |
| **Método > outcome** | Explica cómo funciona, no promete | ✅ Mejorable | ✅ Excelente | ✅ Bueno |
| **Especificidad** | Nombres concretos, no genéricos | ✅ Bueno | ✅ Excelente | ✅ Bueno |
| **Diferenciador real** | Comunica el valor verdadero | ⚠️ Débil | ✅ Bueno | ✅ Bueno |
| **Evita marketing-speak** | Lenguaje directo, sin hype | ⚠️ Débil | ✅ Excelente | ✅ Bueno |

---

## Próximos pasos

1. Actualizar **GitHub repository short description** (vía GitHub web UI)
2. Actualizar **README.md** líneas 13-23 (Philosophy section)
3. Actualizar **package.json** description field
4. Revisar **PRODUCT.md** (línea 15) — ya está bien, pero alinearlo con nuevas redacciones
5. Considerar aplicar mismo criterio a descripciones en otras plataformas (LinkedIn, Twitter, web homepage)
