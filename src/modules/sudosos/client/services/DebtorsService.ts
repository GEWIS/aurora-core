/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FineHandoutEventResponse } from '../models/FineHandoutEventResponse';
import type { HandoutFinesRequest } from '../models/HandoutFinesRequest';
import type { PaginatedFineHandoutEventResponse } from '../models/PaginatedFineHandoutEventResponse';
import type { UserToFineResponse } from '../models/UserToFineResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DebtorsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get all fine handout events
     * @returns PaginatedFineHandoutEventResponse All existing fine handout events
     * @throws ApiError
     */
    public returnAllFineHandoutEvents({
take,
skip,
}: {
/**
 * How many entries the endpoint should return
 */
take?: number,
/**
 * How many entries should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedFineHandoutEventResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fines',
            query: {
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
     * Get all fine handout events
     * @returns FineHandoutEventResponse Requested fine handout event with corresponding fines
     * @throws ApiError
     */
    public returnSingleFineHandoutEvent({
id,
}: {
/**
 * The id of the fine handout event which should be returned
 */
id: number,
}): CancelablePromise<FineHandoutEventResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fines/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Delete a fine
     * @returns void 
     * @throws ApiError
     */
    public deleteFine({
id,
}: {
/**
 * The id of the fine which should be deleted
 */
id: number,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/fines/single/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Return all users that had at most -5 euros balance both now and on the reference date.
 * For all these users, also return their fine based on the reference date.
     * @returns UserToFineResponse List of eligible fines
     * @throws ApiError
     */
    public calculateFines({
referenceDates,
userTypes,
}: {
/**
 * Dates to base the fines on. Every returned user has at
 * least five euros debt on every reference date. The height of the fine is based on the first date in the array.
 */
referenceDates: Array<string>,
/**
 * List of all user types fines should be calculated for 1 (MEMBER), 2 (ORGAN), 3 (VOUCHER), 4 (LOCAL_USER), 5 (LOCAL_ADMIN), 6 (INVOICE), 7 (AUTOMATIC_INVOICE).
 */
userTypes?: Array<number>,
}): CancelablePromise<Array<UserToFineResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fines/eligible',
            query: {
                'userTypes': userTypes,
                'referenceDates': referenceDates,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Handout fines to all given users. Fines will be handed out "now" to prevent rewriting history.
     * @returns FineHandoutEventResponse Created fine handout event with corresponding fines
     * @throws ApiError
     */
    public handoutFines({
requestBody,
}: {
requestBody: HandoutFinesRequest,
}): CancelablePromise<FineHandoutEventResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fines/handout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Send an email to all given users about their possible future fine.
     * @returns void 
     * @throws ApiError
     */
    public notifyAboutFutureFines({
requestBody,
}: {
requestBody: HandoutFinesRequest,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/fines/notify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

}
