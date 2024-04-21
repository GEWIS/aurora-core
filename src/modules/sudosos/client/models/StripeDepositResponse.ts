/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';
import type { StripeDepositStatusResponse } from './StripeDepositStatusResponse';

export type StripeDepositResponse = (BaseResponse & {
/**
 * The ID of the payment intent in Stripe
 */
stripeId: string;
/**
 * Current status of the deposit
 */
depositStatus: Array<StripeDepositStatusResponse>;
/**
 * The amount deposited
 */
amount: DineroObjectResponse;
/**
 * User that deposited money
 */
to: BaseUserResponse;
});
