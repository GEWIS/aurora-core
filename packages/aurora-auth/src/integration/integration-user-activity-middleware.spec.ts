import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntegrationUserActivityMiddleware from './integration-user-activity-middleware';
import type { Request, Response, NextFunction } from 'express';

const mockUpdate = vi.fn();
const mockGetRepository = vi.fn(() => ({ update: mockUpdate }));

vi.mock('@gewis/aurora-core/ports/data-source', () => ({
  resolveDataSource: () => ({ getRepository: mockGetRepository }),
}));

vi.mock('./entities/index', () => ({ IntegrationUser: class IntegrationUser {} }));

function makeReq(overrides: Partial<Request> = {}): Request {
  return { headers: {}, ...overrides } as unknown as Request;
}

describe('IntegrationUserActivityMiddleware', () => {
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    next = vi.fn();
    mockUpdate.mockReset();
    mockGetRepository.mockClear();
  });

  describe('when req.user is not set', () => {
    it('calls next without updating repo', async () => {
      const req = makeReq();
      await IntegrationUserActivityMiddleware(req, {} as Response, next as NextFunction);
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledOnce();
    });
  });

  describe('when req.user is set but has no integrationUserId', () => {
    it('calls next without updating repo', async () => {
      const req = makeReq({ user: { id: 'u1', name: 'User', roles: [] } } as any);
      await IntegrationUserActivityMiddleware(req, {} as Response, next as NextFunction);
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledOnce();
    });
  });

  describe('when req.user has integrationUserId', () => {
    it('updates lastSeen for that integration user and calls next', async () => {
      mockUpdate.mockResolvedValue({});
      const req = makeReq({
        user: { id: 'u2', name: 'User', roles: [], integrationUserId: 42 },
      } as any);
      await IntegrationUserActivityMiddleware(req, {} as Response, next as NextFunction);
      expect(mockUpdate).toHaveBeenCalledWith(
        42,
        expect.objectContaining({ lastSeen: expect.any(Date) }),
      );
      expect(next).toHaveBeenCalledOnce();
    });
  });
});
