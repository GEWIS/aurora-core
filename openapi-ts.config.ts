import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: './build/swagger.json',
  output: `../narrowcasting-client/src/api/`,
  types: {
    enums: 'typescript',
  },
});
