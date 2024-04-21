/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';

export type VoucherGroupRequest = {
    /**
     * Name of the group
     */
    name: string;
    /**
     * Date from which the included cards are active
     */
    activeStartDate: string;
    /**
     * Date from which cards are no longer active
     */
    activeEndDate: string;
    /**
     * Start balance to be assigned
 * to the voucher users
     */
    balance: DineroObjectRequest;
    /**
     * Amount of users to be assigned to the voucher group
     */
    amount: number;
};
