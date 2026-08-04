import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      // Flags widespread, legitimate patterns (mount flags for hydration safety,
      // state derived from URL/hash on mount, polling counters) as errors.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
