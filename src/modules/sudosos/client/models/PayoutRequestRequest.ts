/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';

export type PayoutRequestRequest = {
    /**
     * The requested amount to be paid out
     */
    amount: DineroObjectRequest;
    /**
     * The bank account number to transfer the money to
     */
    bankAccountNumber: string;
    /**
     * The name of the owner of the bank account
     */
    bankAccountName: string;
};
