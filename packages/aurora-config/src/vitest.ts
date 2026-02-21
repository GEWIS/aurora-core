import { defineConfig, mergeConfig } from 'vitest/config';
import type { InlineConfig } from 'vitest/node';

const baseEsbuild = {
  target: 'esnext' as const,
  tsconfigRaw: {
    compilerOptions: {
      experimentalDecorators: true,
    },
  },
};

const baseCoverageThresholds = {
  lines: 95,
  functions: 95,
  branches: 95,
  statements: 95,
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

  const config: { test: InlineConfig } = {
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

  if (decorators) {
    return mergeConfig(defineConfig({ esbuild: baseEsbuild }), defineConfig(config));
  }

  return defineConfig(config);
}
