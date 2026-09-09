import js from "@eslint/js";
import html from "eslint-plugin-html";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**"],
  },
  js.configs.recommended,
  {
    files: [
      "api/**/*.js",
      "scripts/**/*.js",
      "lib/**/*.js",
      "test/**/*.js",
      "eslint.config.js",
      "stylelint.config.js",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.nodeBuiltin,
    },
  },
  {
    files: ["index.html", "assets/**/*.js"],
    plugins: {
      html,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
  },
];
