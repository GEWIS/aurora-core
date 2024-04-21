/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';

export type TransferRequest = {
    /**
     * Description of the transfer
     */
    description?: string;
    /**
     * Amount of money being transferred
     */
    amount?: DineroObjectRequest;
    /**
     * Type of transfer
     */
    type?: number;
    /**
     * from which user the money is being transferred
     */
    fromId?: number;
    /**
     * to which user the money is being transferred.
     */
    toId?: number;
};
