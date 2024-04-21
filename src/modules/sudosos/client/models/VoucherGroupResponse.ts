/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { DineroObjectRequest } from './DineroObjectRequest';
import type { UserResponse } from './UserResponse';

export type VoucherGroupResponse = (BaseResponse & {
/**
 * Name of the voucher group
 */
name: string;
/**
 * Start date of the voucher group
 */
activeStartDate?: string;
/**
 * End date of the voucher group
 */
activeEndDate: string;
/**
 * Users in the voucher group
 */
users: Array<UserResponse>;
/**
 * Start balance to be assigned
 * to the voucher users
 */
balance: DineroObjectRequest;
/**
 * Amount of users to be assigned to the voucher group
 */
amount: number;
});
