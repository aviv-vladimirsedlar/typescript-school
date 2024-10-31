import pluginJs from '@eslint/js';
import reactAppConfig from 'eslint-config-react-app';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const cleanGlobals = (globalSet) =>
  Object.fromEntries(Object.entries(globalSet).map(([key, value]) => [key.trim(), value]));

// Filter out "flowtype" rules from reactAppConfig
const reactAppRules = Object.fromEntries(
  Object.entries(reactAppConfig.rules).filter(([key]) => !key.startsWith('flowtype/'))
);

const config = [
  {
    ignores: ['coverage/'], // Ignore the coverage folder
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], // Include JSX and TSX for React
    languageOptions: {
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.jest),
      },
    },
    plugins: {
      import: eslintPluginImport,
      jest: eslintPluginJest,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'jsx-a11y': eslintPluginJsxA11y,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the version of React
      },
    },
    rules: {
      ...reactAppRules, // Spread react-app config rules without flowtype rules
      ...eslintPluginJest.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      semi: 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

export default config;