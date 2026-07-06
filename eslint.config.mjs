import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const config = [
  {
    ignores: [
      '.next/**',
      '.source/**',
      'node_modules/**',
      'src/generated/**',
      'next-env.d.ts',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
];

export default config;
