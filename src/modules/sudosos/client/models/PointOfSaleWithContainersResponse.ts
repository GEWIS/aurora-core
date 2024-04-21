/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContainerWithProductsResponse } from './ContainerWithProductsResponse';
import type { PointOfSaleResponse } from './PointOfSaleResponse';

export type PointOfSaleWithContainersResponse = (PointOfSaleResponse & {
/**
 * The containers
 * in the point-of-sale.
 */
containers: Array<ContainerWithProductsResponse>;
});
