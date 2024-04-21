/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';
import type { PointOfSaleResponse } from './PointOfSaleResponse';
import type { SubTransactionResponse } from './SubTransactionResponse';

export type TransactionResponse = (BaseResponse & {
/**
 * The account from which the transaction
 * is subtracted.
 */
from: BaseUserResponse;
/**
 * The user that created the transaction, if not
 * same as 'from'.
 */
createdBy?: BaseUserResponse;
/**
 * The subtransactions
 * belonging to this transaction.
 */
subTransactions: Array<SubTransactionResponse>;
/**
 * The POS at which this transaction
 * has been created
 */
pointOfSale: PointOfSaleResponse;
/**
 * The total cost of the
 * transaction
 */
totalPriceInclVat: DineroObjectResponse;
});
