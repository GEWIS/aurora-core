/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProductRequest } from '../models/CreateProductRequest';
import type { FileRequest } from '../models/FileRequest';
import type { PaginatedProductResponse } from '../models/PaginatedProductResponse';
import type { ProductResponse } from '../models/ProductResponse';
import type { UpdateProductRequest } from '../models/UpdateProductRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all existing products
     * @returns PaginatedProductResponse All existing products
     * @throws ApiError
     */
    public getAllProducts({
take,
skip,
}: {
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
            url: '/products',
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
     * Create a new product.
     * @returns ProductResponse The created product entity
     * @throws ApiError
     */
    public createProduct({
requestBody,
}: {
/**
 * The product which should be created
 */
requestBody: CreateProductRequest,
}): CancelablePromise<ProductResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/products',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Update an existing product.
     * @returns ProductResponse The created product entity
     * @throws ApiError
     */
    public updateProduct({
id,
requestBody,
}: {
/**
 * The id of the product which should be updated
 */
id: number,
/**
 * The product which should be updated
 */
requestBody: UpdateProductRequest,
}): CancelablePromise<ProductResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/products/{id}',
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
     * Returns the requested product
     * @returns ProductResponse The requested product entity
     * @throws ApiError
     */
    public getSingleProduct({
id,
}: {
/**
 * The id of the product which should be returned
 */
id: number,
}): CancelablePromise<ProductResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/products/{id}',
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
     * Upload a new image for a product
     * @returns void 
     * @throws ApiError
     */
    public updateProductImage({
id,
formData,
}: {
/**
 * The id of the product which should be returned
 */
id: number,
/**
 * product image
 */
formData: FileRequest,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/products/{id}/image',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

}
