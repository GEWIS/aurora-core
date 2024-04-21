/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseVatGroupResponse } from './BaseVatGroupResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';

export type BaseProductResponse = (BaseResponse & {
/**
 * The name of the product.
 */
name: string;
/**
 * The price of the product.
 */
priceInclVat: DineroObjectResponse;
/**
 * The VAT percentage
 */
vat: BaseVatGroupResponse;
});
