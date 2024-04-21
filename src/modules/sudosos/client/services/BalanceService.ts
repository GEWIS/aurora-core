/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BalanceResponse } from '../models/BalanceResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BalanceService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get balance of the current user
   * @returns BalanceResponse The requested user's balance
   * @throws ApiError
   */
  public getBalances(): CancelablePromise<BalanceResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/balances',
      errors: {
        400: `Validation error`,
        404: `Not found error`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * Get balance of the current user
   * @returns BalanceResponse The requested user's balance
   * @throws ApiError
   */
  public getAllBalance({
    date,
    minBalance,
    maxBalance,
    hasFine,
    minFine,
    maxFine,
    userTypes,
    orderBy,
    orderDirection,
    take,
    skip,
  }: {
    /**
     * Timestamp to get balances for
     */
    date?: string;
    /**
     * Minimum balance
     */
    minBalance?: number;
    /**
     * Maximum balance
     */
    maxBalance?: number;
    /**
     * Only users with(out) fines
     */
    hasFine?: boolean;
    /**
     * Minimum fine
     */
    minFine?: number;
    /**
     * Maximum fine
     */
    maxFine?: number;
    /**
     * Filter based on user type.
     */
    userTypes?:
      | 'MEMBER'
      | 'ORGAN'
      | 'VOUCHER'
      | 'LOCAL_USER'
      | 'LOCAL_ADMIN'
      | 'INVOICE'
      | 'AUTOMATIC_INVOICE';
    /**
     * Column to order balance by - eg: id,amount
     */
    orderBy?: string;
    /**
     * Order direction
     */
    orderDirection?: 'ASC' | 'DESC';
    /**
     * How many transactions the endpoint should return
     */
    take?: number;
    /**
     * How many transactions should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<{ records: Array<BalanceResponse> }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/balances/all',
      query: {
        date: date,
        minBalance: minBalance,
        maxBalance: maxBalance,
        hasFine: hasFine,
        minFine: minFine,
        maxFine: maxFine,
        userTypes: userTypes,
        orderBy: orderBy,
        orderDirection: orderDirection,
        take: take,
        skip: skip,
      },
      errors: {
        400: `Validation error`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * Retrieves the requested balance
   * @returns BalanceResponse The requested user's balance
   * @throws ApiError
   */
  public getBalanceId({
    id,
  }: {
    /**
     * The id of the user for which the saldo is requested
     */
    id: number;
  }): CancelablePromise<BalanceResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/balances/{id}',
      path: {
        id: id,
      },
      errors: {
        400: `Validation error`,
        404: `Not found error`,
        500: `Internal server error`,
      },
    });
  }
}
