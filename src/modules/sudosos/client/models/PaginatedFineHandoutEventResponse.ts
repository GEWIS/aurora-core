/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseFineHandoutEventResponse } from './BaseFineHandoutEventResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedFineHandoutEventResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned fine handout events
     */
    records: Array<BaseFineHandoutEventResponse>;
};
