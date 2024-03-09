import { Client } from 'ldapts';
import { HttpStatusCode } from 'axios';
import { ApiException } from '../../../helpers/customError';

export interface Member {
  dn: string;
  employeeNumber: string;
  displayName: string;
}

const activeDirectoryConnector = new Client({
  url: process.env.LDAP_URI!
});

export async function activeDirectoryConnect() {
  await activeDirectoryConnector
    .bind(process.env.LDAP_BIND_DN!, process.env.LDAP_BIND_DN_PASSWORD!)
    .catch((e) => {
      // eslint-disable-next-line no-console -- useful for when AD acts up
      console.error(e);
      throw new ApiException(
        HttpStatusCode.InternalServerError,
        'Failed to connect to Active Directory'
      );
    });
}

export async function getBoard() {
  return (
    await activeDirectoryConnector.search(process.env.LDAP_BASE_DN!, {
      scope: 'sub',
      filter: process.env.LDAP_BOARD_FILTER!,
      attributes: ['employeeNumber', 'displayName']
    })
  ).searchEntries as unknown as Array<Member>;
}

export async function getKeyHolders() {
  return (
    await activeDirectoryConnector.search(process.env.LDAP_BASE_DN!, {
      scope: 'sub',
      filter: process.env.LDAP_KEY_FILTER!,
      attributes: ['employeeNumber', 'displayName']
    })
  ).searchEntries as unknown as Array<Member>;
}

export async function getERO() {
  return (
    await activeDirectoryConnector.search(process.env.LDAP_BASE_DN!, {
      scope: 'sub',
      filter: process.env.LDAP_ERO_FILTER!,
      attributes: ['employeeNumber', 'displayName']
    })
  ).searchEntries as unknown as Array<Member>;
}
