/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BalanceResponse } from './BalanceResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';

export type UserToFineResponse = {
    /**
     * User ID
     */
    id: number;
    /**
     * Amount to fine
     */
    fineAmount: DineroObjectResponse;
    /**
     * Balances at the given reference dates
     */
    balances: Array<BalanceResponse>;
};
