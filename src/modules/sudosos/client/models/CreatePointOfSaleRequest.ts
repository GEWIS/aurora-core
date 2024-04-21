/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreatePointOfSaleRequest = {
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
     * ID of the user who will own the POS, if undefined it will
 * default to the token ID.
     */
    ownerId?: number;
};
