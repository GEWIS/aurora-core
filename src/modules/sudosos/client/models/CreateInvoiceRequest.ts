/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceEntryRequest } from './InvoiceEntryRequest';

export type CreateInvoiceRequest = {
    /**
     * The recipient of the Invoice.
     */
    forId: number;
    /**
     * The creator of the Invoice, defaults to the ID of the requester.
     */
    byId?: number;
    /**
     * Name of the addressed.
     */
    addressee: string;
    /**
     * The description of the invoice.
     */
    description: string;
    /**
     * Custom entries to be added to the invoice
     */
    customEntries?: Array<InvoiceEntryRequest>;
    /**
     * IDs of the transactions to add to the Invoice.
     */
    transactionIDs?: Array<number>;
    /**
     * For creating an Invoice for all transactions from a specific date.
     */
    fromDate?: string;
    /**
     * If the invoice is an credit Invoice
 * If an invoice is a credit invoice the relevant subtransactions are defined as all the sub transactions which have `subTransaction.toId == forId`.
     */
    isCreditInvoice: boolean;
};
