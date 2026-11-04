import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['build/**', 'dist/**', 'api/dist/**', 'node_modules/**', 'api/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{ts,tsx}'], rules: { 'no-undef': 'off' } },
  {
    files: ['src/**/*.{ts,tsx}', 'shared/**/*.ts'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['api/**/*.{ts,mjs}', '*.js', '*.mjs'],
    languageOptions: { globals: globals.node },
  }
);
