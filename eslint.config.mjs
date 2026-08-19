import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      // Este codebase usa setState dentro de useEffect intencionalmente para:
      // 1. Hydration safety (mount flags: setMounted(true) después del primer render)
      // 2. Lectura de localStorage/URL params (solo disponible en cliente post-mount)
      // 3. Sincronizar estado con eventos externos (media query, scroll, route)
      // La regla la dejamos como "off" porque el patrón es deliberado y documentado.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
