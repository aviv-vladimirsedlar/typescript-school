import pluginJs from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJest from 'eslint-plugin-jest';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['coverage/'], // Ignore the coverage folder
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: { import: eslintPluginImport, jest: eslintPluginJest },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
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
