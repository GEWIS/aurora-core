/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventShiftResponse } from './EventShiftResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedEventShiftResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned event shifts
     */
    records: Array<EventShiftResponse>;
};
