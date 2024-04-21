/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BasePointOfSaleResponse } from './BasePointOfSaleResponse';
import type { BaseUserResponse } from './BaseUserResponse';

export type PointOfSaleResponse = (BasePointOfSaleResponse & {
/**
 * The owner of the point-of-sale.
 */
owner?: BaseUserResponse;
/**
 * Revision of the POS
 */
revision: number;
/**
 * Whether this POS requires users to
 * authenticate themselves before making a transaction
 */
useAuthentication: boolean;
});
