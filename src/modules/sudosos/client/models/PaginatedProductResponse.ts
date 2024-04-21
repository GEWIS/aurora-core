/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationResult } from './PaginationResult';
import type { ProductResponse } from './ProductResponse';

export type PaginatedProductResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned products
     */
    records: Array<ProductResponse>;
};
