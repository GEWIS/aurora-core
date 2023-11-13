import { Strategy as CustomStrategy } from 'passport-custom';
import { Strategy } from 'passport';

export default async function getStrategy(): Promise<Strategy> {
  return new CustomStrategy(
    (req, callback) => {
      callback(null, {
        given_name: 'mock',
        resource_access: {
          'narrowcasting-test': {
            roles: [
              ['PRIV - Narrowcasting Test Admin'],
            ],
          },
        },
      });
    },
  );
}
