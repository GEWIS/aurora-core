export interface User {
  given_name: string;
  resource_access: {
    'narrowcasting-test': {
      roles: string[];
    },
  },
}
