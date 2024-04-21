/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedBasePayoutRequestResponse } from '../models/PaginatedBasePayoutRequestResponse';
import type { PayoutRequestRequest } from '../models/PayoutRequestRequest';
import type { PayoutRequestResponse } from '../models/PayoutRequestResponse';
import type { PayoutRequestStatusRequest } from '../models/PayoutRequestStatusRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PayoutRequestsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all payout requests given the filter parameters
     * @returns PaginatedBasePayoutRequestResponse All existing payout requests
     * @throws ApiError
     */
    public getAllPayoutRequests({
requestedById,
approvedById,
fromDate,
tillDate,
status,
take,
skip,
}: {
/**
 * ID of user(s) who requested a payout
 */
requestedById?: (number | Array<number>),
/**
 * ID of user(s) who approved a payout
 */
approvedById?: (number | Array<number>),
/**
 * Start date for selected transactions (inclusive)
 */
fromDate?: string,
/**
 * End date for selected transactions (exclusive)
 */
tillDate?: string,
/**
 * Status of the payout requests (OR relation)
 */
status?: string,
/**
 * How many payout requests the endpoint should return
 */
take?: number,
/**
 * How many payout requests should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedBasePayoutRequestResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/payoutrequests',
            query: {
                'requestedById': requestedById,
                'approvedById': approvedById,
                'fromDate': fromDate,
                'tillDate': tillDate,
                'status': status,
                'take': take,
                'skip': skip,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Create a new payout request
     * @returns PayoutRequestResponse The created payout request.
     * @throws ApiError
     */
    public createPayoutRequest({
requestBody,
}: {
/**
 * New payout request
 */
requestBody: PayoutRequestRequest,
}): CancelablePromise<PayoutRequestResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/payoutrequests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
            },
        });
    }

    /**
     * Get a single payout request
     * @returns PayoutRequestResponse Single payout request with given id
     * @throws ApiError
     */
    public getSinglePayoutRequest({
id,
}: {
/**
 * The ID of the payout request object that should be returned
 */
id: number,
}): CancelablePromise<PayoutRequestResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/payoutrequests/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Nonexistent payout request id`,
            },
        });
    }

    /**
     * Create a new status for a payout request
     * @returns PayoutRequestResponse The updated payout request
     * @throws ApiError
     */
    public setPayoutRequestStatus({
id,
requestBody,
}: {
/**
 * The ID of the payout request object that should be returned
 */
id: number,
/**
 * New state of payout request
 */
requestBody: PayoutRequestStatusRequest,
}): CancelablePromise<PayoutRequestResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/payoutrequests/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                404: `Nonexistent payout request id`,
            },
        });
    }

}
