import { Client } from 'ldapts';

export interface Member {
  dn: string;
  employeeNumber: string;
  displayName: string;
}

let activeDirectoryConnector: Client;

export async function activeDirectoryConnect() {
  activeDirectoryConnector = new Client({
    connectTimeout: 5000,
    url: process.env.LDAP_URI!
  });

  await activeDirectoryConnector.bind(
    process.env.LDAP_BIND_DN!,
    process.env.LDAP_BIND_DN_PASSWORD!
  );
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
