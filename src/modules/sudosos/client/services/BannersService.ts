/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerRequest } from '../models/BannerRequest';
import type { BannerResponse } from '../models/BannerResponse';
import type { FileRequest } from '../models/FileRequest';
import type { PaginatedBannerResponse } from '../models/PaginatedBannerResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BannersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all existing banners
     * @returns PaginatedBannerResponse All existing banners
     * @throws ApiError
     */
    public getAllBanners({
take,
skip,
}: {
/**
 * How many banners the endpoint should return
 */
take?: number,
/**
 * How many banners should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedBannerResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/banners',
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
     * Saves a banner to the database
     * @returns BannerResponse The created banner entity
     * @throws ApiError
     */
    public create({
requestBody,
}: {
/**
 * The banner which should be created
 */
requestBody: BannerRequest,
}): CancelablePromise<BannerResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/banners',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Uploads a banner image to the given banner
     * @returns void 
     * @throws ApiError
     */
    public updateImage({
id,
formData,
}: {
/**
 * The id of the banner
 */
id: number,
/**
 * banner image
 */
formData: FileRequest,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/banners/{id}/image',
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

    /**
     * Returns the requested banner
     * @returns BannerResponse The requested banner entity
     * @throws ApiError
     */
    public getBanner({
id,
}: {
/**
 * The id of the banner which should be returned
 */
id: number,
}): CancelablePromise<BannerResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/banners/{id}',
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
     * Updates the requested banner
     * @returns BannerResponse The requested banner entity
     * @throws ApiError
     */
    public update({
id,
requestBody,
}: {
/**
 * The id of the banner which should be updated
 */
id: number,
/**
 * The updated banner
 */
requestBody: BannerRequest,
}): CancelablePromise<BannerResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/banners/{id}',
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
     * Deletes the requested banner
     * @returns void 
     * @throws ApiError
     */
    public delete({
id,
}: {
/**
 * The id of the banner which should be deleted
 */
id: number,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/banners/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not found error`,
            },
        });
    }

    /**
     * Returns all active banners
     * @returns PaginatedBannerResponse All active banners
     * @throws ApiError
     */
    public getActive({
take,
skip,
}: {
/**
 * How many banners the endpoint should return
 */
take?: number,
/**
 * How many banners should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedBannerResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/banners/active',
            query: {
                'take': take,
                'skip': skip,
            },
            errors: {
                400: `Validation error`,
            },
        });
    }

    /**
     * Returns all existing banners
     * @returns PaginatedBannerResponse All existing banners
     * @throws ApiError
     */
    public getAllOpenBanners({
take,
skip,
}: {
/**
 * How many banners the endpoint should return
 */
take?: number,
/**
 * How many banners should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedBannerResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/open/banners',
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

}
