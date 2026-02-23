import { defineConfig, mergeConfig } from 'vitest/config';
import type { InlineConfig } from 'vitest/node';

const baseCoverageThresholds = {
  lines: 95,
  functions: 95,
  branches: 95,
  statements: 95,
};

const baseResolve = {
  conditions: ['development'],
};

export interface DefineConfigOptions {
  setupFiles?: string[];
  coverageInclude?: string[];
  coverageThresholds?: boolean;
  decorators?: boolean;
}

export function defineBaseConfig(
  options: DefineConfigOptions = {},
): ReturnType<typeof defineConfig> {
  const {
    setupFiles,
    coverageInclude = ['src/**/*.ts'],
    coverageThresholds = true,
    decorators = false,
  } = options;

  const esbuildConfig = {
    target: 'esnext' as const,
    ...(decorators
      ? {
          tsconfigRaw: {
            compilerOptions: {
              experimentalDecorators: true,
              emitDecoratorMetadata: true,
            },
          },
        }
      : {}),
  };

  const testConfig: { test: InlineConfig } = {
    test: {
      environment: 'node',
      include: ['src/**/*.spec.ts'],
      setupFiles,
      coverage: {
        provider: 'v8',
        include: coverageInclude,
        exclude: ['src/**/*.spec.ts', 'src/tests/**'],
        ...(coverageThresholds ? { thresholds: baseCoverageThresholds } : {}),
      },
    },
  };

  return mergeConfig(
    defineConfig({ resolve: baseResolve, esbuild: esbuildConfig }),
    defineConfig(testConfig),
  );
}
