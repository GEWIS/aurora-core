/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';

export type BaseUserResponse = (BaseResponse & {
/**
 * The name of the user.
 */
firstName: string;
/**
 * The last name of the user
 */
lastName: string;
/**
 * The nickname of the user
 */
nickname?: string;
});
