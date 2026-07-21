# 🌾 Molino — Universidad Pública de Libre Acceso

> El conocimiento simbólico es patrimonio de la humanidad.

## Filosofía

Molino es una plataforma educativa de código abierto que explora sistemas simbólicos (numerología, astrología, zodiaco chino) con total transparencia y privacidad.

### Principios

- 🔓 **Código Abierto**: Todo el código está disponible para revisión, mejora y fork.
- 🕊️ **Sin Datos**: No guardamos nada. Ni cookies, ni localStorage, ni análisis.
- 📚 **Conocimiento Libre**: Todo el contenido se basa en fuentes públicas.
- 🧬 **Transparencia**: Cada cálculo está explicado con sus fórmulas y fuentes.

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Estructura del Proyecto
molino/
├── app/
│ ├── page.tsx # Landing
│ ├── onboarding/ # Formulario efímero
│ ├── profile/ # Resultados (sin persistencia)
│ └── explore/ # Explorador de compatibilidad
├── components/
│ ├── layout/ # Header, Footer
│ ├── sections/ # Secciones de la landing
│ └── shared/ # Componentes reutilizables
├── lib/
│ ├── engines/ # Motores de cálculo
│ ├── storage/ # Ephemeral session
│ └── data/ # Datos públicos
└── public/ # Assets

## Instalación

```bash
git clone https://github.com/morpheus3232/molino.git
cd molino
npm install
npm run dev
Contribuir
Haz un fork del proyecto

Crea una rama para tu feature (git checkout -b feature/nueva-funcionalidad)

Haz commit de tus cambios (git commit -m 'Agrega nueva funcionalidad')

Push a la rama (git push origin feature/nueva-funcionalidad)

Abre un Pull Request

Licencia
MIT — Libre para usar, modificar y compartir.

Créditos
Sistema GG33 — Gary Grinberg (como referencia)

Numerología Pitagórica — Fuente histórica

Astrología Occidental — Zodíaco Tropical

Zodiaco Chino — Ciclo Sexagenario
