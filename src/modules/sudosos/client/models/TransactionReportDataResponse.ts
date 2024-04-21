/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TransactionReportCategoryEntryResponse } from './TransactionReportCategoryEntryResponse';
import type { TransactionReportEntryResponse } from './TransactionReportEntryResponse';
import type { TransactionReportVatEntryResponse } from './TransactionReportVatEntryResponse';

export type TransactionReportDataResponse = {
    /**
     * The entries grouped by product
     */
    entries: Array<TransactionReportEntryResponse>;
    /**
     * The entries grouped by category
     */
    categories: Array<TransactionReportCategoryEntryResponse>;
    /**
     * The entries grouped by vat
     */
    vat: Array<TransactionReportVatEntryResponse>;
};
