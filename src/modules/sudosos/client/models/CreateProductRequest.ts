/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';

export type CreateProductRequest = {
    /**
     * Name of the product
     */
    name: string;
    /**
     * Price of the product
     */
    priceInclVat: DineroObjectRequest;
    /**
     * VAT group ID of the product
     */
    vat: number;
    /**
     * Category of the product
     */
    category: number;
    /**
     * Alcohol percentage of the product in 2 decimals
     */
    alcoholPercentage: number;
    /**
     * If product is featured
     */
    featured?: boolean;
    /**
     * If product is preferred
     */
    preferred?: boolean;
    /**
     * If product is shown on narrowcasting screens
     */
    priceList?: boolean;
    /**
     * ID of the owner
     */
    ownerId: number;
};
