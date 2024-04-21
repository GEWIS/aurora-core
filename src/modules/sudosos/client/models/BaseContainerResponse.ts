/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';

export type BaseContainerResponse = (BaseResponse & {
/**
 * The name of the container.
 */
name: string;
/**
 * Public status of the container.
 */
public?: boolean;
/**
 * The container revision.
 */
revision?: number;
});
