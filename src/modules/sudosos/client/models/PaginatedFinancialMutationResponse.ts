/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinancialMutationResponse } from './FinancialMutationResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedFinancialMutationResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned mutations
     */
    records: Array<FinancialMutationResponse>;
};
