/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseProductResponse } from './BaseProductResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';
import type { ProductCategoryResponse } from './ProductCategoryResponse';

export type ProductResponse = (BaseProductResponse & {
/**
 * The product revision ID
 */
revision: number;
/**
 * The owner of the product.
 */
owner: BaseUserResponse;
/**
 *           The category the product belongs to.
 */
category: ProductCategoryResponse;
/**
 * The price of the product
 * excluding VAT
 */
priceExclVat: DineroObjectResponse;
/**
 * The URL to the picture representing this product.
 */
image?: string;
/**
 * The percentage of alcohol in this product.
 */
alcoholPercentage: number;
/**
 * If product is featured
 */
featured: boolean;
/**
 * If product is preferred
 */
preferred: boolean;
/**
 * If product is shown on narrow casting screens
 */
priceList: boolean;
});
