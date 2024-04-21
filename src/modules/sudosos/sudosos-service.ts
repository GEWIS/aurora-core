import { DineroObjectResponse, SudoSOSClient, UserResponse } from './client';

interface SudoSOSDebtorResponse {
  userId: number;
  name: string;
  balance: DineroObjectResponse;
  fine?: DineroObjectResponse;
}

export default class SudoSOSService {
  private url: string;

  static apiAvailable(): boolean {
    return (
      !!process.env.SUDOSOS_URL &&
      !!process.env.SUDOSOS_USER_ID &&
      !!process.env.SUDOSOS_KEY &&
      !!process.env.SUDOSOS_BORRELMODE_POS_ID &&
      !Number.isNaN(Number(process.env.SUDOSOS_USER_ID)) &&
      !Number.isNaN(Number(process.env.SUDOSOS_BORRELMODE_POS_ID))
    );
  }

  constructor() {
    if (!SudoSOSService.apiAvailable())
      throw new Error(
        'SudoSOS Service cannot be initialized, because not all environment variables are set.',
      );
    this.url = process.env.SUDOSOS_URL ?? '';
  }

  /**
   * Get a SudosOS bearer token
   * @private
   */
  private async getToken(): Promise<string> {
    const response = await new SudoSOSClient({
      BASE: process.env.SUDOSOS_URL,
    }).authenticate.keyAuthentication({
      requestBody: {
        userId: Number(process.env.SUDOSOS_USER_ID),
        key: process.env.SUDOSOS_KEY || '',
      },
    });
    return response.token;
  }

  /**
   * Get an instance of the SudoSOS client class with a bearer token
   * @private
   */
  private async getClient(): Promise<SudoSOSClient> {
    const token = await this.getToken();
    return new SudoSOSClient({
      TOKEN: token,
      BASE: process.env.SUDOSOS_URL,
    });
  }

  /**
   * Get all users of the given type from SudoSOS
   * @param client
   * @private
   */
  private async getUsers(client: SudoSOSClient) {
    let users: UserResponse[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop,@typescript-eslint/naming-convention
      const { records, _pagination } = await client.users.getAllUsers({
        take: 100000,
        skip: users.length,
      });
      if (records.length === 0) {
        if (_pagination.count !== users.length) {
          throw new Error('Missing some users!!!');
        }
        break;
      }
      users = users.concat(records);
    }
    return users;
  }

  /**
   * Get a list of top-50 debtors
   * @private
   */
  public async getDebtors(): Promise<SudoSOSDebtorResponse[]> {
    const client = await this.getClient();
    const userTypes = ['MEMBER', 'LOCAL_USER'];
    const { records: balances } = await client.balance.getAllBalance({
      maxBalance: -500,
      orderBy: 'amount',
      orderDirection: 'ASC',
      take: 50,
      userTypes: userTypes as any,
    });
    const users = await this.getUsers(client);

    const userMap = new Map<number, UserResponse>();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    return balances
      .map((b): SudoSOSDebtorResponse | null => {
        const user = userMap.get(b.id);
        if (!user) {
          return null;
        }
        return {
          userId: b.id,
          name: `${user.firstName} ${user.lastName}`,
          balance: b.amount,
          fine: b.fine,
        };
      })
      .filter((b) => !!b)
      .map((b) => b!);
  }

  public async getPriceList() {
    const client = await this.getClient();
    const response = await client.pointofsale.getAllPointOfSaleProducts({
      id: Number(process.env.SUDOSOS_BORRELMODE_POS_ID),
      take: 100000,
    });
    return response.records.filter((p) => p.priceList);
  }
}
