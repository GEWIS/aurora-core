/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';

export type FineResponse = (BaseResponse & {
/**
 * Fine amount
 */
amount: DineroObjectResponse;
/**
 * User that got the fine
 */
user: BaseUserResponse;
});
