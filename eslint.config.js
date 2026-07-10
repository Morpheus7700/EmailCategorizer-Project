// ESLint flat config (ESLint 9+).
// Lints the extension's browser-side scripts. No build step required.
const js = require("@eslint/js");
const globals = require("globals");
const prettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: ["node_modules/**", "web-ext-artifacts/**"],
  },
  js.configs.recommended,
  {
    files: ["content.js", "popup.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      eqeqeq: ["error", "smart"],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  // Config files run under Node.js.
  {
    files: ["eslint.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  // Disable stylistic rules that Prettier owns.
  prettier,
];
