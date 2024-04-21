/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';

export type BoilerPayoutRequestResponse = (BaseResponse & {
/**
 * The user that requested a payout
 */
requestedBy: BaseUserResponse;
/**
 * The user that potentially approved the payout request
 */
approvedBy?: BaseUserResponse;
/**
 * The amount requested to be paid out
 */
amount: DineroObjectResponse;
});
