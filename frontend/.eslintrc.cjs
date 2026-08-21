module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    'eslint:recommended',
  ],

  plugins: [
    'react',
    // Registered so the exhaustive-deps disable comment in hooks/useApi.js
    // refers to a rule that exists. Without the plugin ESLint errors on the
    // unknown rule name, which was failing the CI lint gate.
    'react-hooks',
  ],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    'no-unused-vars': 'warn',
    'no-undef': 'error',

    'react/jsx-uses-vars': 'error',
    'react/jsx-no-undef': 'error',

    'react-hooks/rules-of-hooks': 'error',
    // Warn rather than error: the codebase has deliberate, commented
    // deviations (useApi builds its dependency list from a caller argument),
    // and a hard error would block CI on a judgement call.
    'react-hooks/exhaustive-deps': 'warn',
  },
};
