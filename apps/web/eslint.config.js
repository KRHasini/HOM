import { nextConfig } from "@hom/config/eslint/next";

const config = [
  ...nextConfig,
  {
    files: ["scripts/**/*.ts", "e2e/**/*.ts"],
    rules: { "no-console": "off" },
  },
];

export default config;
