/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BoilerPayoutRequestResponse } from './BoilerPayoutRequestResponse';
import type { PayoutRequestStatusResponse } from './PayoutRequestStatusResponse';

export type PayoutRequestResponse = (BoilerPayoutRequestResponse & {
/**
 * Statuses of this
 * payout response over time
 */
status: Array<PayoutRequestStatusResponse>;
/**
 * Bank account number
 */
bankAccountNumber: string;
/**
 * Name of the account owner
 */
bankAccountName: string;
});
