/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationResult } from './PaginationResult';
import type { UserResponse } from './UserResponse';

export type PaginatedUserResponse = {
    /**
     * Pagination metadata
     */
    _pagination: PaginationResult;
    /**
     * Returned users
     */
    records: Array<UserResponse>;
};
