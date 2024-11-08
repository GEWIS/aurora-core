import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: './build/swagger.json',
  output: `../narrowcasting-client/src/api/`,
  plugins: [
    '@hey-api/schemas',
    '@hey-api/services',
    {
      enums: 'typescript',
      name: '@hey-api/types',
    },
  ],
});
