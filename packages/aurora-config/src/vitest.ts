import { defineConfig, mergeConfig } from 'vitest/config';
import type { InlineConfig } from 'vitest/node';

const baseEsbuildTarget = {
  target: 'esnext' as const,
};

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
  tsconfig?: string;
}

export function defineBaseConfig(
  options: DefineConfigOptions = {},
): ReturnType<typeof defineConfig> {
  const {
    setupFiles,
    coverageInclude = ['src/**/*.ts'],
    coverageThresholds = true,
    decorators = false,
    tsconfig = './tsconfig.spec.json',
  } = options;

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

  const esbuildConfig = { ...baseEsbuildTarget, tsconfig };

  const base = mergeConfig(
    defineConfig({ resolve: baseResolve, esbuild: esbuildConfig }),
    defineConfig(testConfig),
  );

  if (decorators) {
    return mergeConfig(base, defineConfig({ esbuild: esbuildConfig }));
  }

  return base;
}
