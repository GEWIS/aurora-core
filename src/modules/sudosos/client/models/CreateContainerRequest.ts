/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateContainerRequest = {
    /**
     * Name of the container
     */
    name: string;
    /**
     *    IDs or requests of the products to add to the container
     */
    products: Array<number>;
    /**
     * Whether the container is public or not
     */
    public: boolean;
    /**
     * Id of the user who will own the container, if undefined it will
 * default to the token ID.
     */
    ownerId?: number;
};
