/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContainerResponse } from './ContainerResponse';
import type { ProductResponse } from './ProductResponse';

export type ContainerWithProductsResponse = (ContainerResponse & {
/**
 * The products in the container.
 */
products: Array<ProductResponse>;
});
