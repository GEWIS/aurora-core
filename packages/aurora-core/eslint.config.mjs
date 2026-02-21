import { defineBaseEslintConfig } from '@gewis/aurora-config/eslint';

export default defineBaseEslintConfig(
  ['./tsconfig.app.json', './tsconfig.spec.json'],
  import.meta.url,
);
