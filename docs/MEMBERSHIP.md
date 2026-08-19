# Membership — roadmap conceptual

> Este documento es **roadmap conceptual**. No hay billing, suscripciones ni endpoints de membership implementados. Ningún flag ni ruta de este documento existe en el código todavía.

Idea central:

> FREE = conocé tus piezas
> PREMIUM = entendé cómo encajan
> MEMBERSHIP = seguí explorando cómo evolucionan

## FREE

Qué recibe hoy (validado, en producción):

- Mapa de identidad completo: numerología, astrología, zodíaco chino, arquetipos.
- Las cuatro secciones del perfil: Identidad, Mundo, Círculo, Inteligencia.
- Timing personal (por intención y fecha).
- Afinidad simbólica con países, marcas y entidades.
- Energía diaria.

## PREMIUM ONE-TIME

Qué recibe (pago único, vía Mercado Pago, ya implementado):

- La síntesis integral de `MolinoInterpretation` dentro de Intelligence: cómo se conectan entre sí los sistemas que el usuario ya vio gratis, patrones integrados, y una interpretación de por qué el momento actual importa para su identidad.
- No es "más pantallas" ni "más datos" — es la lectura que cruza lo que el free ya mostró por separado.

## MEMBERSHIP (conceptual, no implementado)

Por qué volvería un usuario que ya pagó el one-time: el mapa de identidad no cambia, pero la relación del usuario con ese mapa sí cambia con el tiempo. Molino ya calcula esto de forma diferente cada vez que se consulta, sin que hoy se lo comuniquemos como valor recurrente:

- **Daily Energy** ya recalcula un resultado distinto cada día (`dailyEnergyEngine`) — hoy es una pantalla, podría ser la razón de volver.
- **Timing** ya recalcula por fecha e intención (`timingEngine`) — cada decisión nueva del usuario es una lectura nueva, no la misma de siempre.
- Ciclos y evolución del perfil en el tiempo (año personal, día personal) son datos que el engine ya deriva de la fecha de nacimiento y la fecha actual — la membership podría enmarcar esto como "cómo se lee tu mapa hoy", en vez de un cálculo aislado.

Ninguna de estas capacidades requiere un engine nuevo. La membresía, si se construye, sería principalmente una capa de **presentación y recurrencia** sobre motores que ya existen — no una feature nueva de cálculo.

Quedan explícitamente fuera de este documento (y de cualquier implementación futura sin una decisión de producto separada): frecuencia de cobro, precio, mecanismo de renovación, y cualquier promesa de contenido que Molino todavía no calcula (ej. "historial de lecturas pasadas" no existe hoy como feature, no se debe comunicar como si existiera).
