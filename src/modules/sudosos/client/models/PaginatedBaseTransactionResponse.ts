/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseTransactionResponse } from './BaseTransactionResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedBaseTransactionResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned banners
     */
    records: Array<BaseTransactionResponse>;
};
