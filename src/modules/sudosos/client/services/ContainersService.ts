/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContainerWithProductsResponse } from '../models/ContainerWithProductsResponse';
import type { CreateContainerRequest } from '../models/CreateContainerRequest';
import type { PaginatedContainerResponse } from '../models/PaginatedContainerResponse';
import type { PaginatedProductResponse } from '../models/PaginatedProductResponse';
import type { UpdateContainerRequest } from '../models/UpdateContainerRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ContainersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all existing containers
     * @returns PaginatedContainerResponse All existing containers
     * @throws ApiError
     */
    public getAllContainers({
take,
skip,
}: {
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
            url: '/containers',
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
     * Create a new container.
     * @returns ContainerWithProductsResponse The created container entity
     * @throws ApiError
     */
    public createContainer({
requestBody,
}: {
/**
 *    The container which should be created
 */
requestBody: CreateContainerRequest,
}): CancelablePromise<ContainerWithProductsResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/containers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns the requested container
     * @returns ContainerWithProductsResponse The requested container
     * @throws ApiError
     */
    public getSingleContainer({
id,
}: {
/**
 * The id of the container which should be returned
 */
id: number,
}): CancelablePromise<ContainerWithProductsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/containers/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Incorrect permissions`,
                404: `Not found error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Update an existing container.
     * @returns ContainerWithProductsResponse The created container entity
     * @throws ApiError
     */
    public updateContainer({
id,
requestBody,
}: {
/**
 * The id of the container which should be updated
 */
id: number,
/**
 *    The container which should be updated
 */
requestBody: UpdateContainerRequest,
}): CancelablePromise<ContainerWithProductsResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/containers/{id}',
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
     * Returns all the products in the container
     * @returns PaginatedProductResponse All products in the container
     * @throws ApiError
     */
    public getProductsContainer({
id,
take,
skip,
}: {
/**
 * The id of the container which should be returned
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
            url: '/containers/{id}/products',
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

    /**
     * Returns all public container
     * @returns PaginatedContainerResponse All existing public containers
     * @throws ApiError
     */
    public getPublicContainers({
take,
skip,
}: {
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
            url: '/containers/public',
            query: {
                'take': take,
                'skip': skip,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }

}
