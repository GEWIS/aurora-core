/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationResult } from './PaginationResult';
import type { ProductCategoryResponse } from './ProductCategoryResponse';

export type PaginatedProductCategoryResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned product categories
     */
    records: Array<ProductCategoryResponse>;
};
