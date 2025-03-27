import {
  BalanceResponse,
  Configuration,
  DineroObjectResponse,
  UserResponse,
} from '@sudosos/sudosos-client';
import { SudoSOSClient } from './sudosos-api-service';
import { SudoSOSSettings, SudoSOSSettingsName } from './sudosos-settings';
import { ServerSettingsStore } from '@gewis/aurora-core-server-settings';

export interface SudoSOSDebtorResponse {
  userId: number;
  firstName: string;
  nickName?: string;
  lastName?: string;
  balance: DineroObjectResponse;
  fine?: DineroObjectResponse;
  isBac: boolean;
  /** If the user has a fine for more than 4 weeks */
  isLongstanding: boolean;
}

export default class SudoSOSService {
  private readonly url: string;

  private client: SudoSOSClient;

  static apiAvailable(): boolean {
    return (
      !!process.env.SUDOSOS_URL &&
      !!process.env.SUDOSOS_USER_ID &&
      !!process.env.SUDOSOS_KEY &&
      !Number.isNaN(Number(process.env.SUDOSOS_USER_ID))
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
    const response = (
      await this.client.balance.getAllBalance(
        undefined,
        undefined,
        -500,
        undefined,
        undefined,
        undefined,
        userTypes as never,
        'amount',
        'ASC',
        undefined,
        50,
      )
    ).data;
    // @ts-ignore
    const balances: BalanceResponse[] = response.records;
    const users = await this.getUsers();

    const userMap = new Map<number, UserResponse>();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    const bacGroupId = ServerSettingsStore.getInstance().getSetting<SudoSOSSettings, 'SudoSOS.BACGroupID'>(SudoSOSSettingsName, 'SudoSOS.BACGroupID');

    const bac =
      bacGroupId > 0
        ? (await this.client.user.getOrganMembers(bacGroupId)).data.records
        : undefined;

    return balances
      .map((b): SudoSOSDebtorResponse | null => {
        const user = userMap.get(b.id);
        if (!user) {
          return null;
        }

        const fineDate = b.fineSince ? new Date(b.fineSince) : undefined;
        const fineTime = fineDate ? new Date().getTime() - fineDate.getTime() : undefined;
        const isLongstanding = fineTime ? fineTime > 1000 * 60 * 60 * 24 * 28 : false;

        return {
          userId: b.id,
          firstName: user.firstName,
          nickName: user.nickname,
          lastName: user.lastName,
          balance: b.amount,
          fine: b.fine,
          isBac: bac?.some((m) => m.id === b.id) ?? false,
          isLongstanding,
        };
      })
      .filter((b) => !!b)
      .map((b) => b!);
  }

  public async getPriceList() {
    const posID = ServerSettingsStore.getInstance().getSetting<SudoSOSSettings, 'SudoSOS.BorrelmodePOSID'>(
      SudoSOSSettingsName,
      'SudoSOS.BorrelmodePOSID'
    )
    const response = await this.client.pos.getAllPointOfSaleProducts(posID);
    return response.data.filter((p) => p.priceList);
  }
}
