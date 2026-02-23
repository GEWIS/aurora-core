import { describe, it, expect, vi } from 'vitest';
import { SecurityGroup } from '@gewis/aurora-core/helpers/security';

vi.mock('@gewis/aurora-core/modules/root/entities', () => ({
  Audio: class Audio {},
  Screen: class Screen {},
  LightsController: class LightsController {},
}));

vi.mock('../integration/entities/index', () => ({
  IntegrationUser: class IntegrationUser {},
}));

vi.mock('@gewis/aurora-core/modules/auth/auth-user', () => ({}));

vi.mock('typeorm', async () => {
  const actual = await vi.importActual<typeof import('typeorm')>('typeorm');
  return {
    ...actual,
    Entity: () => () => {},
    PrimaryColumn: () => () => {},
    OneToOne: () => () => {},
    JoinColumn: () => () => {},
    BaseEntity: class {},
  };
});

const { default: ApiKey } = await import('./api-key');

function makeApiKey(overrides: Record<string, any> = {}): InstanceType<typeof ApiKey> {
  const key = new ApiKey();
  Object.assign(key, overrides);
  return key;
}

describe('ApiKey', () => {
  describe('asAuthUser', () => {
    it('returns empty roles and ids when no relations are set', () => {
      const key = makeApiKey({ key: 'k1' });
      const user = key.asAuthUser();
      expect(user.roles).toEqual([]);
      expect(user.id).toBe('');
      expect(user.name).toBe('');
      expect(user.endpoints).toBeUndefined();
    });

    it('adds AUDIO_SUBSCRIBER role when audio is set', () => {
      const key = makeApiKey({ audio: { id: 1, name: 'AudioA' } });
      const user = key.asAuthUser();
      expect(user.roles).toContain(SecurityGroup.AUDIO_SUBSCRIBER);
      expect(user.id).toBe('audio1');
      expect(user.name).toBe('AudioA');
      expect(user.audioId).toBe(1);
    });

    it('adds SCREEN_SUBSCRIBER role when screen is set', () => {
      const key = makeApiKey({ screen: { id: 2, name: 'ScreenB' } });
      const user = key.asAuthUser();
      expect(user.roles).toContain(SecurityGroup.SCREEN_SUBSCRIBER);
      expect(user.id).toBe('screen2');
      expect(user.name).toBe('ScreenB');
      expect(user.screenId).toBe(2);
    });

    it('adds LIGHTS_SUBSCRIBER role when lightsController is set', () => {
      const key = makeApiKey({ lightsController: { id: 3, name: 'LightsC' } });
      const user = key.asAuthUser();
      expect(user.roles).toContain(SecurityGroup.LIGHTS_SUBSCRIBER);
      expect(user.id).toBe('lightsController3');
      expect(user.name).toBe('LightsC');
      expect(user.lightsControllerId).toBe(3);
    });

    it('adds INTEGRATION_USER role and sets endpoints when integrationUser is set', () => {
      const key = makeApiKey({
        integrationUser: { id: 4, name: 'IntUser', endpoints: ['ep1', 'ep2'] },
      });
      const user = key.asAuthUser();
      expect(user.roles).toContain(SecurityGroup.INTEGRATION_USER);
      expect(user.id).toBe('integrationUser4');
      expect(user.name).toBe('IntUser');
      expect(user.endpoints).toEqual(['ep1', 'ep2']);
      expect(user.integrationUserId).toBe(4);
    });

    it('combines multiple relations', () => {
      const key = makeApiKey({
        audio: { id: 1, name: 'A' },
        screen: { id: 2, name: 'S' },
      });
      const user = key.asAuthUser();
      expect(user.roles).toContain(SecurityGroup.AUDIO_SUBSCRIBER);
      expect(user.roles).toContain(SecurityGroup.SCREEN_SUBSCRIBER);
      expect(user.id).toBe('audio1-screen2');
      expect(user.name).toBe('A-S');
    });
  });
});
