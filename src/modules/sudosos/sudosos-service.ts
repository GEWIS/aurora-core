import { Configuration, DineroObjectResponse, UserResponse } from '@sudosos/sudosos-client';
import { SudoSOSClient } from './sudosos-api-service';

interface SudoSOSDebtorResponse {
  userId: number;
  balance: DineroObjectResponse;
  fine?: DineroObjectResponse;
  user: UserResponse;
}

export default class SudoSOSService {
  private url: string;

  private client: SudoSOSClient;

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
  async initialize(): Promise<SudoSOSService> {
    const response = await new SudoSOSClient(this.url).authenticate.keyAuthentication({
      userId: Number(process.env.SUDOSOS_USER_ID),
      key: process.env.SUDOSOS_KEY!,
    });

    this.client = new SudoSOSClient(
      this.url,
      new Configuration({
        accessToken: response.data.token,
      }),
    );
    return this;
  }

  /**
   * Get all users of the given type from SudoSOS
   * @private
   */
  private async getUsers() {
    let users: UserResponse[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop,@typescript-eslint/naming-convention
      const { records, _pagination } = (await this.client.user.getAllUsers(10000, users.length))
        .data;
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
    const userTypes = ['MEMBER', 'LOCAL_USER'];
    const balances = (
      await this.client.balance.getAllBalance(
        undefined,
        undefined,
        -500,
        undefined,
        undefined,
        undefined,
        userTypes as any,
        'amount',
        'ASC',
        50,
      )
    ).data;
    const users = await this.getUsers();

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
          balance: b.amount,
          fine: b.fine,
          user,
        };
      })
      .filter((b) => !!b)
      .map((b) => b!);
  }

  public async getPriceList() {
    const response = await this.client.pos.getAllPointOfSaleProducts(
      Number(process.env.SUDOSOS_BORRELMODE_POS_ID),
      100000,
    );
    return response.data.records.filter((p) => p.priceList);
  }
}
