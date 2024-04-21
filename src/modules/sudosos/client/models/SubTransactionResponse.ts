/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseContainerResponse } from './BaseContainerResponse';
import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';
import type { SubTransactionRowResponse } from './SubTransactionRowResponse';

export type SubTransactionResponse = (BaseResponse & {
/**
 * The account that the transaction is added to.
 */
to: BaseUserResponse;
/**
 * The container from which all
 * products in the SubTransactionRows are bought
 */
container: BaseContainerResponse;
/**
 * The rows of this
 * SubTransaction
 */
subTransactionRows: Array<SubTransactionRowResponse>;
/**
 * The total cost of the sub
 * transaction
 */
totalPriceInclVat: DineroObjectResponse;
});
