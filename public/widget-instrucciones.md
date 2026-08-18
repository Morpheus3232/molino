# Widget de Molino — instrucciones de instalación

Insertá la calculadora de Camino de Vida de Molino en tu sitio (WordPress, Webflow, HTML plano o cualquier CMS que acepte HTML embebido) en 3 pasos.

## 1. Copiá el código

```html
<iframe
  src="https://www.molino.app/embed"
  width="100%"
  height="440"
  style="border:none;border-radius:20px;overflow:hidden;"
  title="Molino — Calculadora de Mapa Personal"
  loading="lazy"
></iframe>
```

## 2. Pegalo donde quieras que aparezca

En WordPress: bloque "HTML personalizado". En Webflow: elemento "Embed". En HTML plano: directo en el `<body>`.

## 3. (Opcional) Personalizá tema y tamaño

Agregá parámetros a la URL del `src`:

- `?theme=light` — fondo claro (por defecto es oscuro).
- `?compact=true` — versión reducida (320px de alto en vez de 440px), sin el texto introductorio.
- Combinados: `https://www.molino.app/embed?theme=light&compact=true`

El visitante completa su fecha de nacimiento y el resultado se abre en una pestaña nueva de molino.app — el cálculo en sí corre 100% en el navegador del usuario, nada se procesa ni se guarda en tu servidor.

---

**Atribución:** el widget incluye un enlace visible a molino.app en su pie. Te pedimos no quitarlo — es lo que mantiene la herramienta gratis para todos.
