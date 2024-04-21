/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedVatGroupResponse } from '../models/PaginatedVatGroupResponse';
import type { UpdateVatGroupRequest } from '../models/UpdateVatGroupRequest';
import type { VatGroupRequest } from '../models/VatGroupRequest';
import type { VatGroupResponse } from '../models/VatGroupResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class VatGroupsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get a list of all VAT groups
     * @returns PaginatedVatGroupResponse A list of all VAT groups
     * @throws ApiError
     */
    public getAllVatGroups({
vatGroupId,
name,
percentage,
deleted,
take,
skip,
}: {
/**
 * ID of the VAT group
 */
vatGroupId?: number,
/**
 * Name of the VAT group
 */
name?: string,
/**
 * VAT percentage
 */
percentage?: number,
/**
 * Whether the VAT groups should be hidden if zero
 */
deleted?: boolean,
/**
 * How many transactions the endpoint should return
 */
take?: number,
/**
 * How many transactions should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedVatGroupResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/vatgroups',
            query: {
                'vatGroupId': vatGroupId,
                'name': name,
                'percentage': percentage,
                'deleted': deleted,
                'take': take,
                'skip': skip,
            },
        });
    }

    /**
     * Create a new VAT group
     * @returns VatGroupResponse The created VAT group entity
     * @throws ApiError
     */
    public createVatGroup({
requestBody,
}: {
/**
 * The VAT group which should be created
 */
requestBody: VatGroupRequest,
}): CancelablePromise<VatGroupResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/vatgroups',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns the requested VAT group
     * @returns VatGroupResponse The requested VAT group entity
     * @throws ApiError
     */
    public getSingleVatGroup({
id,
}: {
/**
 * The ID of the VAT group which should be returned
 */
id: number,
}): CancelablePromise<VatGroupResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/vatgroups/{id}',
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
     * Create a new VAT group
     * @returns VatGroupResponse The created VAT group entity
     * @throws ApiError
     */
    public updateVatGroup({
id,
requestBody,
}: {
/**
 * The ID of the VAT group which should be updated
 */
id: number,
/**
 * The VAT group information
 */
requestBody: UpdateVatGroupRequest,
}): CancelablePromise<VatGroupResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/vatgroups/{id}',
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
     * Get the VAT collections needed for VAT declarations
     * @returns PaginatedVatGroupResponse A list of all VAT groups with declarations
     * @throws ApiError
     */
    public getVatDeclarationAmounts({
year,
period,
}: {
/**
 * Calendar year for VAT declarations
 */
year: number,
/**
 * Period for VAT declarations
 */
period: string,
}): CancelablePromise<PaginatedVatGroupResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/vatgroups/declaration',
            query: {
                'year': year,
                'period': period,
            },
        });
    }

}
