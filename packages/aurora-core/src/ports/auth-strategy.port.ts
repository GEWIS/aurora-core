import * as express from 'express';
import { container } from 'tsyringe';
import { AuthUser } from '../modules/auth/auth-user';

export const AUTH_STRATEGY_REGISTRY_TOKEN = Symbol('AuroraAuthStrategyRegistry');

export interface IAuthStrategy {
  readonly name: string;
  authenticate(request: express.Request, scopes: string[]): Promise<AuthUser>;
}

export type AuthStrategyRegistry = Map<string, IAuthStrategy>;

export const registerAuthStrategy = (strategy: IAuthStrategy): void => {
  let registry: AuthStrategyRegistry;
  if (!container.isRegistered(AUTH_STRATEGY_REGISTRY_TOKEN)) {
    registry = new Map();
    container.registerInstance(AUTH_STRATEGY_REGISTRY_TOKEN, registry);
  } else {
    registry = container.resolve<AuthStrategyRegistry>(AUTH_STRATEGY_REGISTRY_TOKEN);
  }
  registry.set(strategy.name, strategy);
};

export const resolveAuthStrategy = (name: string): IAuthStrategy => {
  if (!container.isRegistered(AUTH_STRATEGY_REGISTRY_TOKEN)) {
    throw new Error(`No auth strategy registered for "${name}".`);
  }
  const registry = container.resolve<AuthStrategyRegistry>(AUTH_STRATEGY_REGISTRY_TOKEN);
  const strategy = registry.get(name);
  if (!strategy) {
    throw new Error(`No auth strategy registered for "${name}".`);
  }
  return strategy;
};
