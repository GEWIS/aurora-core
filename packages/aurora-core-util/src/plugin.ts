import { Router } from 'express';

export type AuroraPlugin = {
  name: string;
  RegisterRoutes: (app: Router) => void;
  RegisterStrategy: () => void;
  Specs: object;
  RegisterEntities: () => void;
  devOnly?: boolean;
};

export interface AuroraConfig {
  auth: AuroraPlugin[];
  plugins: AuroraPlugin[];
}
