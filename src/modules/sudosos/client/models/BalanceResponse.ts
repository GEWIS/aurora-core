/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectResponse } from './DineroObjectResponse';

export type BalanceResponse = {
    /**
     * ID of the user this balance belongs to
     */
    id: number;
    /**
     * Date at which this user had this balance
     */
    date: string;
    /**
     * The amount of balance this user has
     */
    amount: DineroObjectResponse;
    /**
     * The amount of fines this user has at the current point in time,
 * aka "now" (if any). Should be ignored if date is not now.
     */
    fine?: DineroObjectResponse;
    /**
     * Timestamp of the first fine
     */
    fineSince?: string;
    /**
     * The ID of the last transaction that was
 * present when the balance was cached
     */
    lastTransactionId?: number;
    /**
     * The ID of the last transfer that was
 * present when the balance was cached
     */
    lastTransferId?: number;
};
