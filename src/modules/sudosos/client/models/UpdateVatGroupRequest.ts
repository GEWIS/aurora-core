/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateVatGroupRequest = {
    /**
     * Name of the VAT group
     */
    name: string;
    /**
     * Whether this group should be hidden
 * in the financial overviews when its value is zero
     */
    deleted: boolean;
    /**
     * Whether this group should
 * be hidden from transactions
     */
    hidden: boolean;
};
