import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './build/swagger.json',
  output: '../aurora-client/src/api/',
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/schemas',
    '@hey-api/sdk',
    {
      enums: 'typescript',
      name: '@hey-api/typescript',
    },
  ],
});
