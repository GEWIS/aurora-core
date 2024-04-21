/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseProductResponse } from './BaseProductResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';

export type TransactionReportEntryResponse = {
    /**
     * The amount of times this product is in the report
     */
    count: number;
    /**
     * The product for this entry
     */
    product: BaseProductResponse;
    /**
     * The price of this entry incl. vat
     */
    totalInclVat: DineroObjectResponse;
    /**
     * The price of this entry excl. vat
     */
    totalExclVat: DineroObjectResponse;
};
