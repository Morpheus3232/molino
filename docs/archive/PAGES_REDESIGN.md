# Fase 7 — Páginas de Producto

## Presentación general

Las 7 páginas de producto representan journeys distintos de autoconocimiento. Cada página sigue un marco de 8 pasos (Objetivo, Historia, Jerarquía, Layout, Componentes, Mobile, Movimiento, CTA, Estados) coherente con el Rediseño de Home (Fase 5), adaptando para cada contexto específico.

## Introducción

Cada página de producto resuelve una pregunta específica del usuario, mostrando diferentes aspectos de la personalidad. Las páginas fluyen naturalmente una a la siguiente, manteniendo la consistencia del sistema de componentes y la narrativa brutalista.

## Proceso de diseño (8-pasos)

1. **Compilar toda la información sobre cada página** – Objetivos, jerarquía actual, componentes existentes, problemas UX, oportunidades de diseño.
2. **Definir 8 pasos narrativos** – mismo framework que Home pero específico por página:
   - **Objetivo** – ¿Qué hace esta página?
   - **Historia** – ¿Cómo fluye el usuario a través? ¿Qué pregunta resuelve?
   - **Jerarquía** – Información arquitegolden, jerarquía visual
   - **Layout** – Composición, grid system, espacios
   - **Componentes** – Componentes específicos a esta página
   - **Mobile** – Optimización móvil adaptada al propósito
   - **Movimiento** – Animaciones, transiciones, micro-interacciones
   - **CTA** – Llamados a la acción, puntos de conversión
   - **Estados** – Estados de interacción, error, loading, hover
3. **Diseñar components reales** – Crear/particionar componentes de Molino relacionados con cada paso
4. **Diseñar experiences completas** – Wireframe de cada página (desktop + mobile), probar flujos de usuario, refinar copy, mejorarlo
5. **Implementar en backlog técnico** – Priorizar por impacto + dependencia

## Requisitos técnicos

- **PAGES_REDESIGN.md** – Documentación de las 7 páginas siguiendo la metodología del Marco de Diseño de Molino (objetivos, historia, jerarquía, layout, componentes, mobile, movimiento, CTA, estados).
- **Aplicación en backlog técnico (Fase 3.0)** – Priorizar componentes nuevos (`<Calendar>`, `<Timeline>`, etc.) y refactorizar las páginas existentes.
- **Referencia cruzada** – Las páginas deben integrarse con el Sistema de Componentes (Fase 6), manteniendo la coherencia visual entre Home y otras páginas.

---

## 1. Mi Mapa (Timeline del perfil)

**Página objetivo:** `app/profile/[hash]/page.tsx`

### Objetivo
- **¿Qué hace esta página?** – Mostrar una vida personal a través de 3 dimensiones interactivas (Identidad, Mundo, Círculo) sobre un timeline.
- **Usuario con perfil (más de 40% del total) genera una vista personalizada con momentos destacados.

### Historia
"Mi historia no es una línea recta, sino un mapa de toda una vida. Cada acontecimiento está en su lugar exacto en el cosmos."

El timeline permite explorar el significado oculto a través de 3 vistas:
- **Identidad** – quién era
- **Mundo** – qué pasó
- **Círculo** – relevancia hoy

**Jerarquía narrativa:**
1. **Rotación inicial** – Día del perfil (hoy, ahora). Introduce la frase "Su mapa de vida, a su tiempo y lugar."
2. **Timeline (3 segundos)** – Navegue con el mouse/trackpad, zoom con scroll. Muestra 7 días alineados horizontalmente, cada uno con fecha y fotograma del acontecimiento.
3. **Panel de detalles (2 segundos)** – Al hacer clic en un día, muestra los tres panes: Identidad (esencia), Mundo (elemento dominante), Círculo (conexiones clave).
4. **CTA final** – "Ver mi mapa completo →" → Enlace a la página `/profile/[hash]` con la versión expandida del timeline.

Tiempo de visión general: ~5 segundos. Tiempo de interacción máximo: 2 minutos (si el usuario expande el panel de detalles).

### Jerarquía
- **Nav superior** – Mi Mapa, ¿Cómo funciona?, Afinidad, Compatibilidad, Energía diaria, Biblioteca
- **Breadcrumb** – Perfil → Timeline
- **Controles** – Búsqueda global, toggles, avatar, logout

**Jerarquía de información:**
- **Nivel 1:** Perfil timeline, identificación de afinidad, visualización de afinidad
- **Nivel 2:** Pares de identidad-mundo-círculo para cada acontecimiento
- **Nivel 3:** Conexiones clave (selección de entidades) para cada acontecimiento

### Layout
**Wireframe (desktop 1440px):**
```
+------------------------------------------------------+
| Nav superior                                          |
+------------------------------------------------------+
| Timeline (40% ancho, 80% alto)         | Detalles (60% ancho) |
| Elemento destacado de timeline        | Título: Identidad     |
| Célula inferior del timeline    | Párrafo del texto      |
| ...                            | CTA: Ver mapa completo |
+------------------------------------------------------+
| Footer (CTA duplicado a la izquierda)                     |
+------------------------------------------------------+
```
**Mobile (375px):**
- Timeline scroll horizontal en scroll container.
- Detalles colapsan en un drawer modal o expanden verticalmente.
- CTA en sticky bottom.

### Componentes
- **Timeline** – `<Calendar>` (Sección 6.7). Grid horizontal de días, eventos destacados en hover tooltips.
- **Panel de detalles** – Título, subtítulo, grilla de 2 columnas, CTA button.
- **Navigation** – HeroNav (reutilizable), ProfileMenu.

### Mobile
- Scroll horizontal con `overflow-x-auto`, `scrollbar-thin`.
- Detalles expanden verticalmente.
- Optimización de touch targets (44px mínimo).

### Movimiento
- Timeline: Entran con `fadeUp` con delay escalonado.
- Panel de detalles: `slideRight` al seleccionar un evento.
- Navegación: Hover effects.

### CTA
- **CTA principal** – "Ver mi mapa completo →" → Redirige a `/profile/[hash]`.
- **Copy** – Para usuarios con perfil: "Ver mi mapa →". Para usuarios sin perfil: "Creá tu mapa →".

### Estados
- Hover/Active en celdas de timeline.
- Focus states con ring de acento.
- Loading states en forms.
- Empty state (no hay fecha seleccionada).

### Implementación
- Crear `<Calendar>` (Fase 6.7) – Componente de visualización de timelines para perfiles.
- Refinar navegación `/profile/[hash]/page.tsx`.
- Integrar con sistema de componentes existente.

---

## 2. Afinidad (`app/affinity/`)

### Objetivo
- **¿Qué hace esta página?** – Explorar afinidades con otros usuarios, filtrar por tipo de afinidad, compararlos visualmente.
- **Propósito** – Ayudar al usuario a conocer mejor a otros a través de conexiones significativas.

### Historia
\"Encontrar a alguien como vos, pero con una historia ligeramente diferente. Comprender el espectro de la afinidad humana."

### Jerarquía
- **Nav superior** – Mi Mapa, ¿Cómo funciona?, Afinidad, Compatibilidad, Energía diaria, Biblioteca
- **Filtros laterales** – Tipo de afinidad, alcance geográfico, criterios de edad
- **Grid** – Lista de afinidades calculadas, cada una con miniatura de perfil y punteo de compatibilidad.

### Layout
**Desktop** – Nav superior + Filtros + Grid de resultados.
**Mobile** – Nav superior + Filtro colapsable + Grid scrollable.

### Componentes
- **Filters** – Chips de filtro, selectores de rango, toggles.
- **Affinity Card** – Imágenes de perfil, nombre, score, badges de afinidad.
- **Comparison UI** – Visualización de diferencias entre dos afinidades.

### Mobile
- Filtros collapse en drawer.
- Grid de afinidades en una columna.
- Navegación inferior sticky.

### Movimiento
- Entran con `fadeUp` escalonado.
- Hover effects en cards.
- Filters accordion expansion.

### CTA
- **CTA principal** – "Ver detalles →" en cada card.
- **Copy** – CTA claro y acción específico.

### Estados
- Hover en cards.
- Active tap en buttons.
- Focus visible.
- Loading mientras carga resultados de afinidad.

---

## 3. Compatibilidad (`app/compatibility/`)

### Objetivo
- **¿Qué hace esta página?** – Comparar entidades (marcas, países, etc.) a través de datos de afinidad generados por IA.
- **Propósito** – Permite tomar decisiones informadas basadas en afinidad algorítmica.

### Historia
\"Saber cómo tus elecciones encajan con el mundo a través de datos."

### Jerarquía
- **Nav superior** – Mi Mapa, ¿Cómo funciona?, Afinidad, Compatibilidad, Energía diaria, Biblioteca
- **Controller** – Selector de categoría (marcas, países, etc.)
- **Grid** – Entidades con score, descripción breve, botón de comparación.

### Layout
**Desktop** – Sidebar de categorías + Grid principal.
**Mobile** – Tab switching entre categorías + Grid compacto.

### Componentes
- **Category Navigation** – Botones de tabs.
- **Entity Grid** – Cards con puntuación, favorito.
- **Comparison View** – Diferencias visuales entre 2 entidades.

### Mobile
- Tabs para categorías.
- Grid unicolumna con altura fija.
- Pull-to-refresh.

### Movimiento
- Tabs switching con slide.
- Cards entrar con stagger.
- Hover highlights.

### CTA
- **CTA principal** – "Comparar seleccionadas →".
- **Copy** – Acción basada en selección.

### Estados
- Hover en cards.
- Active en buttons.
- Focus visible.
- Loading mientras compara.

---

## 4. Energía diaria (`app/daily-energy/`)

### Objetivo
- **¿Qué hace esta página?** – Mostrar energía, estado de ánimo y tendencias diarias para cada día de una afinidad.
- **Propósito** – Integrar el flujo temporal de emociones y energía en el narrative de afinidad.

### Historia
\"El ritmo de una vida capture todas sus momentos."

### Jerarquía
- **Nav superior** – Mi Mapa, ¿Cómo funciona?, Afinidad, Compatibilidad, Energía diaria, Biblioteca
- **Grid** – Cards diarias con iconos, números, estado de ánimo.

### Layout
**Desktop** – Grid de 7 días + Resumen semanal.
**Mobile** – Scroll horizontal de días + Gráfico semanal.

### Componentes
- **Day Card** – Icono de energía, número, estado de ánimo.
- **Weekly Summary** – Gráfico de tendencias.
- **Emotion Scale** – Selector visual de estado de ánimo.

### Mobile
- Swipe para navegar entre días.
- Mini gráfico para vista previa.

### Movimiento
- Cards entrar con `fadeUp` escalonado.
- Intercambio de día con slide.
- Animación de cambio de estado de ánimo.

### CTA
- **CTA principal** – "Ver energía completa →".
- **Copy** – Acción para vista expandida.

### Estados
- Hover en cards.
- Active tap en navegación de días.
- Focus visible.
- Loading mientras carga datos.

---

## 5. Conocimiento (`app/conocimiento/`)

### Objetivo
- **¿Qué hace esta página?** – Proveer contenido educativo sobre numerología, astrología, zodiaco chino con secciones verticales.
- **Propósito** – Educar mientras se navega por el conocimiento de autoconocimiento.

### Historia
\"Cada camino de autoconocimiento revela una pieza del rompecabezas personal."

### Jerarquía
- **Nav superior** – Mi Mapa, ¿Cómo funciona?, Afinidad, Compatibilidad, Energía diaria, Biblioteca
- **Sidebar** – Índice vertical de temas (Numerología, Astrología, Zodiaco Chino)
- **Main** – Contenido detallado del tema seleccionado.

### Layout
**Desktop** – Sidebar left + Content right.
**Mobile** – Bottom sheet para sidebar, top navigation para contenido.

### Componentes
- **Topic Navigation** – Vertical list, sticky when scrolling.
- **Content Viewer** – Markdown components, images, interactive elements.
- **Glossary** – Popups on hover for specialized terms.

### Mobile
- Swipe between topics.
- Collapsible table of contents.
- Bottom navigation for sections.

### Movimiento
- Nav entries with fadeUp.
- Content slide in on topic selection.
- Glossary popups.

### CTA
- **CTA principal** – "Empezar aprendizaje →".
- **Copy** – Action oriented.

### Estados
- Hover on topics.
- Active on navigation.
- Focus visible.
- Loading for content.

---

## 6. Explorar (`app/explore/`)

### Objetivo
- **¿Qué hace esta página?** – Permite explorar afinidades por categorías, con cards y sistema de filtros avanzado.
- **Propósito** – Facilitar el descubrimiento casual de afinidades basadas en preferencias.

### Historia
\"Explora el mapa de identidades desconocidas. Cada clic revela una nueva perspectiva."

### Jerarquía
- **Nav superior** – Mi Mapa, ¿Cómo funciona?, Afinidad, Compatibilidad, Energía diaria, Biblioteca
- **Filtros** – Tags de temas, rango de scores, etiqueta de ubicación.
- **Grid** – Cards de afinidades con mini bio, afinidad, botón de acción.

### Layout
**Desktop** – Filtros left + Grid right.
**Mobile** – Top filters + Bottom grid.

### Componentes
- **Filter Panel** – Checkboxes, ranges, sliders.
- **Affinity Grid** – Cards con imágenes, badges, scores.
- **Search Bar** – Búsqueda global con suggestions.

### Mobile
- Collapsible filters.
- Infinite scroll grid.
- Pull-to-refresh.

### Movimiento
- Filters slide in from side.
- Cards entrar con staggered animation.
- Search bar fixed at top.

### CTA
- **CTA principal** – "Ver más afinidades →".
- **Copy** – Call to action clear.

### Estados
- Hover en cards.
- Active en buttons.
- Focus visible.
- Loading mientras carga más afinidades.

---

## 7. Buscador (`app/profile/insights/`)

### Objetivo
- **¿Qué hace esta página?** – Mostrar informaciónd de afinidad del usuario, tendencias, insights y posibles conexiones para explorar.
- **Propósito** – Resumir el perfil del usuario con insights actionables.

### Historia
\"Tu mapa de vida te ofrece direcciones."

### Jerarquía
- **Nav superior** – Mi Mapa, ¿Cómo funciona?, Afinidad, Compatibilidad, Energía diaria, Biblioteca
- **Grid** – Insights, tendencias, recomendaciones.

### Layout
**Desktop** – Sidebar de insights + Main content.
**Mobile** – Tabs para insights/tendencias/recomendaciones.

### Componentes
- **Insight Cards** – Título, descripción, score, acción.
- **Trends Visualization** – Gráfico con datos.
- **Recommendations** – Lista de afinidades relacionadas.

### Mobile
- Swipe entre tabs.
- Compact cards.
- Bottom navigation.

### Movimiento
- Tabs switching.
- Cards entrar con fadeUp.
- Hover effects.

### CTA
- **CTA principal** – "Crear afinidad →".
- **Copy** – Action oriented.

### Estados
- Hover on cards.
- Active on buttons.

## Conclusión

Las 7 páginas de producto siguen un marco consistente, manteniendo la coherencia visual y la narrativa a través del Sistema de Componentes de Molino, mientras permiten a cada página cumplir su propósito específico de autoconocimiento.

**Próxima Fase — Implementación!**.