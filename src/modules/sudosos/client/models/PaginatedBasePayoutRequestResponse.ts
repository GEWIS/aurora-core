/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BasePayoutRequestResponse } from './BasePayoutRequestResponse';
import type { PaginationResult } from './PaginationResult';

export type PaginatedBasePayoutRequestResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned payout requests
     */
    records: Array<BasePayoutRequestResponse>;
};
