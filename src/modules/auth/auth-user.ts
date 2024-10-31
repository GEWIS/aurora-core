import { SecurityGroup } from '../../helpers/security';

interface AuthUser {
  id: string;
  name: string;
  roles: SecurityGroup[];

  audioId?: number;
  lightsControllerId?: number;
  screenId?: number;
}

/**
 * Check if the given object is an AuthUser
 * @param obj - The object to check
 */
function isAuthUser(obj: unknown): obj is AuthUser {
  return (
    (obj as AuthUser)?.id !== undefined &&
    typeof (obj as AuthUser)?.id === 'string' &&
    (obj as AuthUser)?.name !== undefined &&
    typeof (obj as AuthUser)?.name === 'string'
  );
}

export { AuthUser, isAuthUser };
