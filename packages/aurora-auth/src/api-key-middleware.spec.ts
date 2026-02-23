import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiKeyMiddleware from './api-key-middleware';
import type { Request, Response, NextFunction } from 'express';

const mockFindOne = vi.fn();
const mockGetRepository = vi.fn(() => ({ findOne: mockFindOne }));
const mockError = vi.fn();

vi.mock('@gewis/aurora-core/ports/data-source', () => ({
  resolveDataSource: () => ({ getRepository: mockGetRepository }),
}));

vi.mock('@gewis/aurora-core/ports/logger', () => ({
  resolveLogger: () => ({ error: mockError }),
}));

vi.mock('./entities/index', () => ({ ApiKey: class ApiKey {} }));

function makeReq(overrides: Partial<Request> = {}): Request {
  return { headers: {}, ...overrides } as unknown as Request;
}

function makeRes(): Response {
  return {} as Response;
}

describe('apiKeyMiddleware', () => {
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    next = vi.fn();
    mockFindOne.mockReset();
    mockError.mockReset();
  });

  describe('when user is already set', () => {
    it('calls next without doing anything', async () => {
      const req = makeReq({ user: { id: 'u', name: 'n', roles: [] } } as any);
      await apiKeyMiddleware(req, makeRes(), next as NextFunction);
      expect(next).toHaveBeenCalledOnce();
      expect(mockGetRepository).not.toHaveBeenCalled();
    });
  });

  describe('when no x-api-key header', () => {
    it('calls next without DB lookup', async () => {
      const req = makeReq();
      await apiKeyMiddleware(req, makeRes(), next as NextFunction);
      expect(next).toHaveBeenCalledOnce();
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('when x-api-key is an array with multiple values', () => {
    it('calls next without DB lookup', async () => {
      const req = makeReq({ headers: { 'x-api-key': ['key1', 'key2'] } });
      await apiKeyMiddleware(req, makeRes(), next as NextFunction);
      expect(next).toHaveBeenCalledOnce();
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('when x-api-key is valid single value', () => {
    it('sets req.user when key is found', async () => {
      const authUser = { id: 'ak1', name: 'ApiKey', roles: [] };
      mockFindOne.mockResolvedValue({ asAuthUser: () => authUser });
      const req = makeReq({ headers: { 'x-api-key': 'valid-key' } });
      await apiKeyMiddleware(req, makeRes(), next as NextFunction);
      expect((req as any).user).toEqual(authUser);
      expect(next).toHaveBeenCalledOnce();
    });

    it('does not set req.user when key is not found', async () => {
      mockFindOne.mockResolvedValue(null);
      const req = makeReq({ headers: { 'x-api-key': 'unknown-key' } });
      await apiKeyMiddleware(req, makeRes(), next as NextFunction);
      expect((req as any).user).toBeUndefined();
      expect(next).toHaveBeenCalledOnce();
    });

    it('logs error and calls next when DB throws', async () => {
      mockFindOne.mockRejectedValue(new Error('DB error'));
      const req = makeReq({ headers: { 'x-api-key': 'key' } });
      await apiKeyMiddleware(req, makeRes(), next as NextFunction);
      expect(mockError).toHaveBeenCalledOnce();
      expect(next).toHaveBeenCalledOnce();
    });

    it('handles single-element array as a valid key', async () => {
      const authUser = { id: 'ak2', name: 'K', roles: [] };
      mockFindOne.mockResolvedValue({ asAuthUser: () => authUser });
      const req = makeReq({ headers: { 'x-api-key': ['single-key'] } });
      await apiKeyMiddleware(req, makeRes(), next as NextFunction);
      expect((req as any).user).toEqual(authUser);
    });
  });
});
