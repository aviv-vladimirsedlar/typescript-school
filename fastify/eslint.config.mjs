import pluginJs from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
    plugins: { import: eslintPluginImport, jest: eslintPluginImport },
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
