/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContainerResponse } from './ContainerResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedContainerResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned containers
     */
    records: Array<ContainerResponse>;
};
