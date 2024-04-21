/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePointOfSaleRequest } from '../models/CreatePointOfSaleRequest';
import type { PaginatedBaseTransactionResponse } from '../models/PaginatedBaseTransactionResponse';
import type { PaginatedContainerResponse } from '../models/PaginatedContainerResponse';
import type { PaginatedPointOfSaleResponse } from '../models/PaginatedPointOfSaleResponse';
import type { PaginatedProductResponse } from '../models/PaginatedProductResponse';
import type { PointOfSaleWithContainersResponse } from '../models/PointOfSaleWithContainersResponse';
import type { UpdatePointOfSaleRequest } from '../models/UpdatePointOfSaleRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PointofsaleService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create a new Point of Sale.
     * @returns PointOfSaleWithContainersResponse The created point of sale entity
     * @throws ApiError
     */
    public createPointOfSale({
requestBody,
}: {
/**
 * The point of sale which should be created
 */
requestBody: CreatePointOfSaleRequest,
}): CancelablePromise<PointOfSaleWithContainersResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/pointsofsale',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns all existing Point of Sales
     * @returns PaginatedPointOfSaleResponse All existing point of sales
     * @throws ApiError
     */
    public getAllPointsOfSale({
take,
skip,
}: {
/**
 * How many points of sale the endpoint should return
 */
take?: number,
/**
 * How many points of sale should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedPointOfSaleResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/pointsofsale',
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
     * Returns the requested Point of Sale
     * @returns PointOfSaleWithContainersResponse The requested point of sale entity
     * @throws ApiError
     */
    public getSinglePointOfSale({
id,
}: {
/**
 * The id of the Point of Sale which should be returned
 */
id: number,
}): CancelablePromise<PointOfSaleWithContainersResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/pointsofsale/{id}',
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
     * Update an existing Point of Sale.
     * @returns PointOfSaleWithContainersResponse The updated Point of Sale entity
     * @throws ApiError
     */
    public updatePointOfSale({
id,
requestBody,
}: {
/**
 * The id of the Point of Sale which should be updated
 */
id: number,
/**
 *    The Point of Sale which should be updated
 */
requestBody: UpdatePointOfSaleRequest,
}): CancelablePromise<PointOfSaleWithContainersResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/pointsofsale/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                404: `Product not found error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns the containers of the requested Point of Sale, empty list if POS does not exist
     * @returns PaginatedContainerResponse All containers of the requested Point of Sale
     * @throws ApiError
     */
    public getAllPointOfSaleContainers({
id,
take,
skip,
}: {
/**
 * The id of the point of sale
 */
id: number,
/**
 * How many containers the endpoint should return
 */
take?: number,
/**
 * How many containers should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedContainerResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/pointsofsale/{id}/containers',
            path: {
                'id': id,
            },
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
     * Returns the products of the requested Point of Sale, empty list if POS does not exist
     * @returns PaginatedProductResponse All products of the requested Point of Sale
     * @throws ApiError
     */
    public getAllPointOfSaleProducts({
id,
take,
skip,
}: {
/**
 * The id of the point of sale
 */
id: number,
/**
 * How many products the endpoint should return
 */
take?: number,
/**
 * How many products should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedProductResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/pointsofsale/{id}/products',
            path: {
                'id': id,
            },
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
     * Returns a Point of Sale transactions
     * @returns PaginatedBaseTransactionResponse The requested Point of Sale transactions
     * @throws ApiError
     */
    public getTransactions({
id,
take,
skip,
}: {
/**
 * The id of the Point of Sale of which to get the transactions.
 */
id: number,
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
            url: '/pointsofsale/{id}/transactions',
            path: {
                'id': id,
            },
            query: {
                'take': take,
                'skip': skip,
            },
            errors: {
                404: `Not found error`,
                500: `Internal server error`,
            },
        });
    }

}
