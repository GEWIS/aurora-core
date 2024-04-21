/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BannerResponse } from './BannerResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedBannerResponse = {
    /**
     * Pagination metadata
     */
    _pagination?: PaginationResult;
    /**
     * Returned banners
     */
    records?: Array<BannerResponse>;
};
