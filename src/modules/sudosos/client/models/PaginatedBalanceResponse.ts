/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BalanceResponse } from './BalanceResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedBalanceResponse = {
    /**
     * Pagination metadata
     */
    _pagination?: PaginationResult;
    /**
     * Returned balance responses
     */
    records?: Array<BalanceResponse>;
};
