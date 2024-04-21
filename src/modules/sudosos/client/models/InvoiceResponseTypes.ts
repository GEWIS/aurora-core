/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseInvoiceResponse } from './BaseInvoiceResponse';
import type { InvoiceEntryResponse } from './InvoiceEntryResponse';

export type InvoiceResponseTypes = (BaseInvoiceResponse & {
/**
 * The entries of the invoice
 */
invoiceEntries?: Array<InvoiceEntryResponse>;
});
