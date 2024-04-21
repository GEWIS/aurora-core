/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseVatGroupResponse } from './BaseVatGroupResponse';

export type VatGroupResponse = (BaseVatGroupResponse & {
/**
 * Name of the VAT group
 */
name?: string;
/**
 * Whether this group is soft-deleted
 */
deleted: boolean;
});
