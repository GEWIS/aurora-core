/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdatePointOfSaleRequest = {
    /**
     * Name of the POS
     */
    name: string;
    /**
     * Whether this POS requires users to
 * authenticate themselves before making a transaction
     */
    useAuthentication: boolean;
    /**
     * IDs or Requests of the containers to add to the POS
     */
    containers?: Array<number>;
    /**
     * ID of the POS to update.
     */
    id: number;
};
