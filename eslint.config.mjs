// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist/**"] },
  js.configs.recommended,

  tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // overrides here
    },
  },
  {
    files: ["**/*.mjs", "**/*.config.*"],
    ...tseslint.configs.disableTypeChecked,
  },
  eslintConfigPrettier,
);
