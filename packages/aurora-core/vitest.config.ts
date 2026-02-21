import { defineBaseConfig } from '@gewis/aurora-config/vitest';

export default defineBaseConfig({
  decorators: true,
  setupFiles: ['./src/tests/setup.ts'],
  coverageInclude: ['src/ports/**/*.ts'],
  coverageThresholds: false,
});
