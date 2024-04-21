/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseUserResponse } from './BaseUserResponse';

export type UserResponse = (BaseUserResponse & {
/**
 * Whether the user activated
 */
active: boolean;
/**
 * Whether the user is deleted
 */
deleted: boolean;
/**
 * The type of user
 */
type: string;
/**
 * If local user, the e-mail of the user
 */
email?: string;
/**
 * Whether this user has accepted the TOS
 */
acceptedToS?: string;
/**
 * Whether data about this
 * user can be used (non-anonymously) for more data science!
 */
extensiveDataProcessing?: boolean;
/**
 * Whether someone is old enough to drink beer
 */
ofAge?: boolean;
/**
 * Whether this user can get a negative balance
 */
canGoIntoDebt: boolean;
});
