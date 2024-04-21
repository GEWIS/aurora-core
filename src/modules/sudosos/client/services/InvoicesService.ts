/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseInvoiceResponse } from '../models/BaseInvoiceResponse';
import type { CreateInvoiceRequest } from '../models/CreateInvoiceRequest';
import type { InvoiceResponse } from '../models/InvoiceResponse';
import type { PaginatedInvoiceResponse } from '../models/PaginatedInvoiceResponse';
import type { UpdateInvoiceRequest } from '../models/UpdateInvoiceRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class InvoicesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all invoices in the system.
     * @returns PaginatedInvoiceResponse All existing invoices
     * @throws ApiError
     */
    public getAllInvoices({
toId,
invoiceId,
currentState,
returnEntries,
fromDate,
tillDate,
take,
skip,
}: {
/**
 * Filter on Id of the debtor
 */
toId?: number,
/**
 * Filter on invoice ID
 */
invoiceId?: number,
/**
 * Filter based on Invoice State.
 */
currentState?: 'CREATED' | 'SENT' | 'PAID' | 'DELETED',
/**
 * Boolean if invoice entries should be returned
 */
returnEntries?: boolean,
/**
 * Start date for selected invoices (inclusive)
 */
fromDate?: string,
/**
 * End date for selected invoices (exclusive)
 */
tillDate?: string,
/**
 * How many entries the endpoint should return
 */
take?: number,
/**
 * How many entries should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedInvoiceResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/invoices',
            query: {
                'toId': toId,
                'invoiceId': invoiceId,
                'currentState': currentState,
                'returnEntries': returnEntries,
                'fromDate': fromDate,
                'tillDate': tillDate,
                'take': take,
                'skip': skip,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }

    /**
     * Adds an invoice to the system.
     * @returns InvoiceResponse The created invoice entity
     * @throws ApiError
     */
    public createInvoice({
requestBody,
}: {
/**
 * The invoice which should be created
 */
requestBody: CreateInvoiceRequest,
}): CancelablePromise<InvoiceResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/invoices',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns a single invoice in the system.
     * @returns InvoiceResponse All existing invoices
     * @throws ApiError
     */
    public getSingleInvoice({
id,
returnEntries,
}: {
/**
 * The id of the requested invoice
 */
id: number,
/**
 * Boolean if invoice entries should be returned, defaults to true.
 */
returnEntries?: boolean,
}): CancelablePromise<InvoiceResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/invoices/{id}',
            path: {
                'id': id,
            },
            query: {
                'returnEntries': returnEntries,
            },
            errors: {
                404: `Invoice not found`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Adds an invoice to the system.
     * @returns BaseInvoiceResponse The updated invoice entity
     * @throws ApiError
     */
    public updateInvoice({
id,
requestBody,
}: {
/**
 * The id of the invoice which should be updated
 */
id: number,
/**
 * The invoice update to process
 */
requestBody: UpdateInvoiceRequest,
}): CancelablePromise<BaseInvoiceResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/invoices/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Deletes an invoice.
     * @returns BaseInvoiceResponse The deleted invoice.
     * @throws ApiError
     */
    public deleteInvoice({
id,
}: {
/**
 * The id of the invoice which should be deleted
 */
id: number,
}): CancelablePromise<BaseInvoiceResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/invoices/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Invoice not found`,
                500: `Internal server error`,
            },
        });
    }

}
