/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedProductCategoryResponse } from '../models/PaginatedProductCategoryResponse';
import type { ProductCategoryRequest } from '../models/ProductCategoryRequest';
import type { ProductCategoryResponse } from '../models/ProductCategoryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductCategoriesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all existing productcategories
     * @returns PaginatedProductCategoryResponse All existing productcategories
     * @throws ApiError
     */
    public getAllProductCategories({
take,
skip,
}: {
/**
 * How many product categories the endpoint should return
 */
take?: number,
/**
 * How many product categories should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedProductCategoryResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/productcategories',
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
     * Post a new productCategory.
     * @returns ProductCategoryResponse The created productcategory entity
     * @throws ApiError
     */
    public createProductCategory({
requestBody,
}: {
/**
 * The productCategory which should be created
 */
requestBody: ProductCategoryRequest,
}): CancelablePromise<ProductCategoryResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/productcategories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Returns the requested productcategory
     * @returns ProductCategoryResponse The requested productcategory entity
     * @throws ApiError
     */
    public getSingleProductCategory({
id,
}: {
/**
 * The id of the productcategory which should be returned
 */
id: number,
}): CancelablePromise<ProductCategoryResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/productcategories/{id}',
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
     * Update an existing productcategory.
     * @returns ProductCategoryResponse The patched productcategory entity
     * @throws ApiError
     */
    public updateProductCategory({
id,
requestBody,
}: {
/**
 * The id of the productcategory which should be returned
 */
id: number,
/**
 * The productcategory which should be created
 */
requestBody: ProductCategoryRequest,
}): CancelablePromise<ProductCategoryResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/productcategories/{id}',
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
