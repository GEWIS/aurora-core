import { defineBaseConfig } from '@gewis/aurora-config/vitest';

export default defineBaseConfig({
  decorators: true,
  setupFiles: ['./vitest.setup.ts'],
});
