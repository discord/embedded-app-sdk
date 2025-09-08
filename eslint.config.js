import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import prettierPlugin from 'eslint-plugin-prettier';
import noUnsanitizedPlugin from 'eslint-plugin-no-unsanitized';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
// import ssrFriendlyPlugin from 'eslint-plugin-ssr-friendly'; // TODO: Update when ESLint 9 compatible
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base JavaScript configuration
  js.configs.recommended,
  
  // Prettier configuration (should be last to override conflicting rules)
  prettierConfig,

  // Global configuration for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node globals  
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly'
      }
    },
    plugins: {
      promise: promisePlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'no-unsanitized': noUnsanitizedPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      'prettier/prettier': 'error',
      'camelcase': [
        'error',
        {
          allow: ['^UNSAFE_'],
          properties: 'always'
        }
      ],
      'one-var': ['error', 'never'],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true
        }
      ],
      'prefer-spread': 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'all'
        }
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ],
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      'no-alert': ['error'],
      'no-debugger': ['error'],
      'quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      'jsx-quotes': ['error', 'prefer-double'],
      'require-await': 'error',
      // Disable import/no-unresolved as TypeScript handles this better
      'import/no-unresolved': 'off',
      'no-use-before-define': 'warn',
      'import/no-duplicates': 0
    }
  },

  // TypeScript-specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array-simple'
        }
      ],
      // TS rule overrides
      'camelcase': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ],
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      // TypeScript handles these errors
      'no-dupe-class-members': 'off',
      'no-undef': 'off',
      'import/default': 'off',
      'import/export': 'off',
      'import/named': 'off'
    }
  },

  // SSR-friendly plugin for src files - TODO: Re-enable when ESLint 9 compatible
  // {
  //   files: ['src/**/*.ts'],
  //   plugins: {
  //     'ssr-friendly': ssrFriendlyPlugin
  //   },
  //   rules: {
  //     ...ssrFriendlyPlugin.configs.recommended.rules
  //   }
  // },

  // Ignore patterns (replaces .eslintignore)
  {
    ignores: [
      'node_modules/**',
      'output/**',
      'rollup.config.mjs',
      'scripts/syncRPCSchema.mjs'
    ]
  }
];