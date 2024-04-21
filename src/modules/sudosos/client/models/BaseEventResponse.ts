/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';

export type BaseEventResponse = (BaseResponse & {
/**
 * Name of the borrel.
 */
name: string;
/**
 * Creator of the event.
 */
createdBy: BaseUserResponse;
/**
 * The starting date of the event.
 */
startDate: string;
/**
 * The end date of the event.
 */
endDate: string;
/**
 * The tpye of event.
 */
type: string;
});
