import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    ignores: ["dist/**", "test/**", "coverage/**"],
  },
  {
    rules: {
      "semi": ["error", "always"], // 语句结尾要以分号结束
      "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }], // 不允许未使用的变量
      "eol-last": ["error", "always"], // 文件行尾要有一行空行,
    }
  },
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    }
  }
];
