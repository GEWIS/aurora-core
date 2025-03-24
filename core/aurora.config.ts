import { start } from '@gewis/aurora-core';
import {AuroraConfig} from '@gewis/aurora-core-util';
import OidcPlugin from '@gewis/aurora-core-auth-oidc';
import MockPlugin from '@gewis/aurora-core-auth-mock';

const config = {
  auth: [
    OidcPlugin,
    {
      ...MockPlugin,
      devOnly: true,
    }
  ]
} as AuroraConfig;

start(config);
