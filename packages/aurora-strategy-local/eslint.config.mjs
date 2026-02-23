import { defineBaseEslintConfig } from '@gewis/aurora-config/eslint';

export default defineBaseEslintConfig(
  ['./tsconfig.lib.json', './tsconfig.spec.json'],
  import.meta.url,
);
