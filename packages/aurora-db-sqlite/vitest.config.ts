import { defineBaseConfig } from '@gewis/aurora-config/vitest';

export default defineBaseConfig({
  decorators: true,
  setupFiles: ['./src/tests/setup.ts'],
});
