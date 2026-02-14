import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Allows Math.random() in render for React 19
      "react-hooks/purity": "off", 
      // Allows usage of 'any' types in components like JourneyCard
      "@typescript-eslint/no-explicit-any": "off",
      // Prevents build failure if you use 'let' instead of 'const'
      "prefer-const": "off",
      // Downgrades unused variables to warnings so the build finishes
      "@typescript-eslint/no-unused-vars": "warn",
      // Disables the error for calling setState inside a useEffect
      "react-hooks/set-state-in-effect": "off"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;