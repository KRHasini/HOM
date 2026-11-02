import { baseConfig } from "@hom/config/eslint/base";

export default [...baseConfig, { ignores: ["src/schema.d.ts"] }];
