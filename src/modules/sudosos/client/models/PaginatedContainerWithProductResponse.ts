/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContainerWithProductsResponse } from './ContainerWithProductsResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedContainerWithProductResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned containers
     */
    records: Array<ContainerWithProductsResponse>;
};
