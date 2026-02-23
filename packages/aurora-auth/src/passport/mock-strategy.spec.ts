import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecurityGroup } from '@gewis/aurora-core/helpers/security';

const mockCallback = vi.fn();
let strategyFn: (req: any, callback: any) => void;

vi.mock('passport', () => ({
  default: {
    use: vi.fn((name: string, strategy: any) => {}),
  },
}));

vi.mock('passport-custom', () => ({
  Strategy: class CustomStrategy {
    constructor(fn: any) {
      strategyFn = fn;
    }
  },
}));

await import('./mock-strategy');

describe('passport mock strategy', () => {
  beforeEach(() => {
    mockCallback.mockReset();
  });

  it('returns user with defaults when body fields are absent', () => {
    strategyFn({ body: {} }, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, {
      id: 'dev',
      name: 'dev',
      roles: [SecurityGroup.ADMIN],
    });
  });

  it('returns user with provided body fields', () => {
    strategyFn({ body: { id: 'u1', name: 'Alice', roles: [SecurityGroup.BOARD] } }, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, {
      id: 'u1',
      name: 'Alice',
      roles: [SecurityGroup.BOARD],
    });
  });
});
