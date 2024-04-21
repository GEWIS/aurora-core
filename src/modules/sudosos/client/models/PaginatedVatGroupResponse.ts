/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationResult } from './PaginationResult';
import type { VatGroupResponse } from './VatGroupResponse';

export type PaginatedVatGroupResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned VAT groups
     */
    records: Array<VatGroupResponse>;
};
