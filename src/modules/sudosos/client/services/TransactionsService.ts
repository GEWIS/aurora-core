/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedBaseTransactionResponse } from '../models/PaginatedBaseTransactionResponse';
import type { TransactionRequest } from '../models/TransactionRequest';
import type { TransactionResponse } from '../models/TransactionResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TransactionsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get a list of all transactions
     * @returns PaginatedBaseTransactionResponse A list of all transactions
     * @throws ApiError
     */
    public getAllTransactions({
fromId,
createdById,
toId,
pointOfSaleId,
productId,
productRevision,
fromDate,
tillDate,
take,
skip,
}: {
/**
 * From-user for selected transactions
 */
fromId?: number,
/**
 * User that created selected transaction
 */
createdById?: number,
/**
 * To-user for selected transactions
 * transactions. Requires ContainerId
 */
toId?: number,
/**
 * Point of sale ID for selected transactions
 */
pointOfSaleId?: number,
/**
 * Product ID for selected transactions
 */
productId?: number,
/**
 * Product Revision for selected
 * transactions. Requires ProductID
 */
productRevision?: number,
/**
 * Start date for selected transactions (inclusive)
 */
fromDate?: string,
/**
 * End date for selected transactions (exclusive)
 */
tillDate?: string,
/**
 * How many transactions the endpoint should return
 */
take?: number,
/**
 * How many transactions should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedBaseTransactionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/transactions',
            query: {
                'fromId': fromId,
                'createdById': createdById,
                'toId': toId,
                'pointOfSaleId': pointOfSaleId,
                'productId': productId,
                'productRevision': productRevision,
                'fromDate': fromDate,
                'tillDate': tillDate,
                'take': take,
                'skip': skip,
            },
        });
    }

    /**
     * Creates a new transaction
     * @returns TransactionResponse The created transaction entity
     * @throws ApiError
     */
    public createTransaction({
requestBody,
}: {
/**
 * The transaction which should be created
 */
requestBody: TransactionRequest,
}): CancelablePromise<TransactionResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/transactions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                403: `Insufficient balance error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Get a single transaction
     * @returns TransactionResponse Single transaction with given id
     * @throws ApiError
     */
    public getSingleTransaction({
id,
}: {
/**
 * The id of the transaction which should be returned
 */
id: number,
}): CancelablePromise<TransactionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/transactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Nonexistent transaction id`,
            },
        });
    }

    /**
     * Updates the requested transaction
     * @returns TransactionResponse The requested transaction entity
     * @throws ApiError
     */
    public updateTransaction({
id,
requestBody,
}: {
/**
 * The id of the transaction which should be updated
 */
id: number,
/**
 * The updated transaction
 */
requestBody: TransactionRequest,
}): CancelablePromise<TransactionResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/transactions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                404: `Not found error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Deletes a transaction
     * @returns void 
     * @throws ApiError
     */
    public deleteTransaction({
id,
}: {
/**
 * The id of the transaction which should be deleted
 */
id: number,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/transactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Nonexistent transaction id`,
            },
        });
    }

    /**
     * Function to validate the transaction immediatly after it is created
     * @returns boolean Transaction validated
     * @throws ApiError
     */
    public validateTransaction({
requestBody,
}: {
/**
 * The transaction which should be validated
 */
requestBody: TransactionRequest,
}): CancelablePromise<boolean> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/transactions/validate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

}
