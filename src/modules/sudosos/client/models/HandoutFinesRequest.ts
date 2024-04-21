/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HandoutFinesRequest = {
    /**
     * Users to fine. If a user is not eligible for a fine, a fine of 0,00 will be handed out.
     */
    userIds: Array<number>;
    /**
     * Reference date to calculate the balance and thus the height of the fine for.
     */
    referenceDate: string;
};
