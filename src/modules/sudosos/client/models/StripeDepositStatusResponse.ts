/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';

export type StripeDepositStatusResponse = (BaseResponse & {
/**
 * State of the Stripe deposit. It can be 1 ('CREATED'), 2 ('PROCESSING'), 3 ('SUCCEEDED'), or 4 ('FAILED')
 */
state: number;
});
