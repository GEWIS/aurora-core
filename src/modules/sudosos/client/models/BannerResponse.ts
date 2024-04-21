/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';

export type BannerResponse = (BaseResponse & {
/**
 * Name/label of the banner
 */
name: string;
/**
 * Location of the image
 */
image?: string;
/**
 * How long the banner should be shown (in seconds)
 */
duration: number;
/**
 * Whether the banner is active. Overrides start and end date
 */
active: boolean;
/**
 * The starting date from which the banner should be shown
 */
startDate: string;
/**
 * The end date from which the banner should no longer be shown
 */
endDate: string;
});
