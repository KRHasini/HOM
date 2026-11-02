import { nextConfig } from "@hom/config/eslint/next";

const config = [
  ...nextConfig,
  {
    files: ["scripts/**/*.ts", "e2e/**/*.ts"],
    // Playwright fixtures receive a `use` callback that is not a React hook.
    rules: { "no-console": "off", "react-hooks/rules-of-hooks": "off" },
  },
];

export default config;
