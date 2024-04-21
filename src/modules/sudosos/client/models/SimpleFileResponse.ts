/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { UserResponse } from './UserResponse';

export type SimpleFileResponse = (BaseResponse & {
/**
 * The filename of the file
 */
downloadName: string;
/**
 * The location of the file in storage
 */
location: string;
/**
 * The user who created this file
 */
createdBy: UserResponse;
});
