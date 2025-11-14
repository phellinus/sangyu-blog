---
description: 这篇博客介绍了ESLint + Prettier 配置Vue+ts项目的步骤，帮助读者更好地理解和应用ESLint + Prettier。
sticky: 5
tags:
  - 前端
tag:
  - 前端工程化
---

# 🔦 ESLint + Prettier 配置步骤(vue3+ts)

以下步骤基于 `nova-panel/eslint.config.js` 的规则，在 `sangyu-ui` 中完成 ESLint + Prettier 的接入。

## 1. 安装开发依赖

在 `sangyu-ui` 根目录执行：

```bash
pnpm add -D \
  @eslint/js \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint \
  eslint-config-prettier \
  eslint-define-config \
  eslint-plugin-prettier \
  eslint-plugin-vue \
  globals \
  prettier \
  vue-eslint-parser
```

## 2. 在 `package.json` 添加常用脚本

```jsonc
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --check .",
    "format:fix": "prettier --write ."
  }
}
```

## 3. 创建 `.prettierrc.js`

仿照 `nova-panel/.prettierrc.js`，在根目录新增 `.prettierrc.js`：

```js
// .prettierrc.js
/** @type {import('prettier').Config} */
export default {
    bracketSpacing: true,
    singleQuote: true,
    arrowParens: 'always',
    trailingComma: 'all',
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    vueIndentScriptAndStyle: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: true,
    proseWrap: 'preserve',
    htmlWhitespaceSensitivity: 'ignore',
    endOfLine: 'auto',
};
```

## 4. 创建 `eslint.config.js`

根据 `nova-panel/eslint.config.js` 改写为 Vue 适配版本：

```js
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import { defineFlatConfig } from 'eslint-define-config';
import * as parserTs from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default defineFlatConfig([
    {
        ignores: ['**/.*', 'dist/*', 'node_modules/*'],
    },
    // Vue 推荐配置
    ...pluginVue.configs['flat/recommended'],
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx,js,jsx,vue}'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: parserTs,
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': pluginTs,
            prettier: pluginPrettier,
        },
        rules: {
            // TypeScript 规则
            ...pluginTs.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-explicit-any': 'off',

            // Vue 规则
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'warn',

            // Prettier 规则
            ...configPrettier.rules,
            'prettier/prettier': [
                'error',
                {},
                {
                    usePrettierrc: true,
                    fileInfoOptions: { withNodeModules: true },
                },
            ],
        },
    },
]);

```
## 5.在.vscode/settings.json添加如下代码
```json
{
  // ESLint 配置
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "eslint.experimental.useFlatConfig": true,

  // 保存时自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // 格式化配置
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // Vue 文件特定配置
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // TypeScript 配置
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}

```
## 6. .vscode/extensions.json

```json
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}

```



## 7. 运行校验命令

```bash
pnpm install        # 安装依赖（首次执行或更新 lockfile）
pnpm lint           # 检查代码
pnpm lint:fix       # 自动修复可处理的问题
pnpm format:fix     # 使用 Prettier 格式化项目
```

如果已有文件被 Prettier 报错（例如 `vite.config.ts`），运行 `pnpm lint:fix` 或 `pnpm format:fix` 即可按统一规则重写。