// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules', 'dist', '.expo', '.expo-shared'],
  },

  ...tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      languageOptions: {
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          ecmaFeatures: { jsx: true },
        },
      },
      rules: {
        // Gentle signal only
        'no-unused-vars': 'warn',

        // Allow RN-style requires and any
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-explicit-any': 'off',

        // Allow Node/Jest globals like module, it, expect
        'no-undef': 'off',
      },
    }
  ),
];