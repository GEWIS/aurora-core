/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseEventResponse } from './BaseEventResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedBaseEventResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned borrel Schemas
     */
    records: Array<BaseEventResponse>;
};
