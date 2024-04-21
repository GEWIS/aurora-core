/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';

export type StripePaymentIntentResponse = (BaseResponse & {
/**
 * ID of the intent in Stripe.
 */
stripeId: string;
/**
 * The client secret of the created Payment Intent.
 */
clientSecret: string;
});
