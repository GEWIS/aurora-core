/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationResult } from './PaginationResult';
import type { PointOfSaleResponse } from './PointOfSaleResponse';

export type PaginatedPointOfSaleResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned points of sale
     */
    records: Array<PointOfSaleResponse>;
};
