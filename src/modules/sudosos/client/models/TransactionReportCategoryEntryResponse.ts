/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectResponse } from './DineroObjectResponse';
import type { ProductCategoryResponse } from './ProductCategoryResponse';

export type TransactionReportCategoryEntryResponse = {
    /**
     * The category of this entry
     */
    category: ProductCategoryResponse;
    /**
     * The price of this entry incl. vat
     */
    totalInclVat: DineroObjectResponse;
    /**
     * The price of this entry excl. vat
     */
    totalExclVat: DineroObjectResponse;
};
