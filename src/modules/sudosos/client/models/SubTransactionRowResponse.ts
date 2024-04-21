/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseProductResponse } from './BaseProductResponse';
import type { BaseResponse } from './BaseResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';

export type SubTransactionRowResponse = (BaseResponse & {
/**
 * The product that has been bought
 */
product: BaseProductResponse;
/**
 * The amount that has been bought
 */
amount: number;
/**
 * The cost of the
 * sub transaction row
 */
totalPriceInclVat: DineroObjectResponse;
});
