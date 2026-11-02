import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

/** Flat config for Next.js apps: core web vitals + a11y + strict TypeScript rules. */
export const nextConfig = [
  { ignores: [".next/**", "out/**", "coverage/**", "next-env.d.ts", "playwright-report/**"] },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/jsx-no-target-blank": "error",
      eqeqeq: ["error", "smart"],
    },
  },
  prettier,
];

export default nextConfig;
