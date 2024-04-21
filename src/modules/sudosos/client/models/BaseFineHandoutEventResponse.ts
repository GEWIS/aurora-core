/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';

export type BaseFineHandoutEventResponse = (BaseResponse & {
/**
 * Reference date of fines
 */
referenceDate: string;
/**
 * User that handed out the fines
 */
createdBy: BaseUserResponse;
});
