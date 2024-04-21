/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObject } from './DineroObject';

export type VatDeclarationRow = {
    /**
     * ID of the VAT group
     */
    id: number;
    /**
     * Name of the VAT group
     */
    name: string;
    /**
     * Percentage of VAT in this group
     */
    percentage: number;
    /**
     * Amount of VAT to be paid to the tax administration
 * per period
     */
    values: Array<DineroObject>;
};
