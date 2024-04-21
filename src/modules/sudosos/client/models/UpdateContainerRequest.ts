/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateContainerRequest = {
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
};
