/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationResult } from './PaginationResult';
import type { VoucherGroupResponse } from './VoucherGroupResponse';

export type PaginatedVoucherGroupResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned voucher groups
     */
    records: Array<VoucherGroupResponse>;
};
