module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'nestjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:nestjs/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
  },
};
