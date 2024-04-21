/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedVoucherGroupResponse } from '../models/PaginatedVoucherGroupResponse';
import type { VoucherGroupRequest } from '../models/VoucherGroupRequest';
import type { VoucherGroupResponse } from '../models/VoucherGroupResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class VouchergroupsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all existing voucher groups
     * @returns PaginatedVoucherGroupResponse All existingvoucher
 * groups without users
     * @throws ApiError
     */
    public getAllVouchergroups({
take,
skip,
}: {
/**
 * How many voucher groups the endpoint should return
 */
take?: number,
/**
 * How many voucher groups should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedVoucherGroupResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/vouchergroups',
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
     * Creates a new voucher group
     * @returns VoucherGroupResponse The created voucher group entity
     * @throws ApiError
     */
    public createVouchergroup({
requestBody,
}: {
/**
 * The voucher group which should be created
 */
requestBody: VoucherGroupRequest,
}): CancelablePromise<VoucherGroupResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/vouchergroups',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns the requested voucher group
     * @returns VoucherGroupResponse The requested voucher group entity
     * @throws ApiError
     */
    public getVouchergroupId({
id,
}: {
/**
 * The id of the voucher group which should be returned
 */
id: number,
}): CancelablePromise<VoucherGroupResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/vouchergroups/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not found error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Updates the requested voucher group
     * @returns VoucherGroupResponse The requested voucher group entity
     * @throws ApiError
     */
    public updateVoucherGroup({
id,
requestBody,
}: {
/**
 * The id of the voucher group which should be updated
 */
id: number,
/**
 * The updated voucher group
 */
requestBody: VoucherGroupRequest,
}): CancelablePromise<VoucherGroupResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/vouchergroups/{id}',
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

}
