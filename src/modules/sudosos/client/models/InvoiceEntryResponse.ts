/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObject } from './DineroObject';

export type InvoiceEntryResponse = {
    /**
     * The description of the entry
     */
    description: string;
    /**
     * Amount of products sold.
     */
    amount: number;
    /**
     * The price per product.
     */
    priceInclVat: DineroObject;
    /**
     * The percentage of VAT applied to this entry
     */
    vatPercentage: number;
};
