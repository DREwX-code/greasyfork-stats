export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "rule-empty-line-before": "never-multi-line",
  },
  overrides: [
    {
      files: ["**/*.html"],
      customSyntax: "postcss-html",
    },
  ],
};
