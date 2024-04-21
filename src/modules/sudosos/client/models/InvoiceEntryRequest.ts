/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';

export type InvoiceEntryRequest = {
    /**
     * The description of the entry
     */
    description: string;
    /**
     * Amount of item sold.
     */
    amount: number;
    /**
     * The price per item.
     */
    priceInclVat: DineroObjectRequest;
    /**
     * The percentage of VAT applied to this item
     */
    vatPercentage: number;
};
