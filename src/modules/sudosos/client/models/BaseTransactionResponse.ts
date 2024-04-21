/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BasePointOfSaleResponse } from './BasePointOfSaleResponse';
import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { Dinero } from './Dinero';

export type BaseTransactionResponse = (BaseResponse & {
/**
 * The account from which the transaction
 * is subtracted.
 */
from: BaseUserResponse;
/**
 * The user that created the transaction, if not
 * same as 'from'..
 */
createdBy?: BaseUserResponse;
/**
 * The POS at which this transaction
 * has been created
 */
pointOfSale: BasePointOfSaleResponse;
/**
 * Total sum of subtransactions
 */
value: Dinero;
});
