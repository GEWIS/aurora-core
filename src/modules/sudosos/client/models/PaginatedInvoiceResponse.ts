/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceResponseTypes } from './InvoiceResponseTypes';
import type { PaginationResult } from './PaginationResult';

export type PaginatedInvoiceResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned Invoices
     */
    records: Array<InvoiceResponseTypes>;
};
