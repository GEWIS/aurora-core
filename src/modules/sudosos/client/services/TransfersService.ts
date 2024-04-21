/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransferRequest } from '../models/TransferRequest';
import type { TransferResponse } from '../models/TransferResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TransfersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all existing transfers
     * @returns TransferResponse All existing transfers
     * @throws ApiError
     */
    public getAllTransfers({
take,
skip,
}: {
/**
 * How many transfers the endpoint should return
 */
take?: number,
/**
 * How many transfers should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<Array<TransferResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/transfers',
            query: {
                'take': take,
                'skip': skip,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }

    /**
     * Post a new transfer.
     * @returns TransferResponse The created transfer entity
     * @throws ApiError
     */
    public createTransfer({
requestBody,
}: {
/**
 * The transfer which should be created
 */
requestBody: TransferRequest,
}): CancelablePromise<TransferResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/transfers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns the requested transfer
     * @returns TransferResponse The requested transfer entity
     * @throws ApiError
     */
    public getSingleTransfer({
id,
}: {
/**
 * The id of the transfer which should be returned
 */
id: number,
}): CancelablePromise<TransferResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/transfers/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not found error`,
                500: `Internal server error`,
            },
        });
    }

}
