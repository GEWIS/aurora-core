import { defineBaseConfig } from '@gewis/aurora-config/vitest';

export default defineBaseConfig({
  decorators: true,
  setupFiles: ['./vitest.setup.ts'],
  coverageInclude: [
    'src/api-key-middleware.ts',
    'src/auth-service.ts',
    'src/authentication.ts',
    'src/endpoint-security.ts',
    'src/session-middleware.ts',
    'src/entities/api-key.ts',
    'src/integration/integration-endpoint-manager.ts',
    'src/integration/integration-user-activity-middleware.ts',
    'src/integration/integration-user-service.ts',
    'src/passport/api-key-strategy.ts',
    'src/passport/index.ts',
    'src/passport/mock-strategy.ts',
    'src/passport/oidc-strategy.ts',
  ],
});
