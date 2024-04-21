/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';
import type { RevisionRequest } from './RevisionRequest';
import type { SubTransactionRequest } from './SubTransactionRequest';

export type TransactionRequest = {
    /**
     * from user id
     */
    from: number;
    /**
     * createdBy user id
     */
    createdBy?: number;
    /**
     * subtransactions
     */
    subTransactions: Array<SubTransactionRequest>;
    /**
     * point of sale
     */
    pointOfSale: RevisionRequest;
    /**
     * total price of the transaction
     */
    totalPriceInclVat: DineroObjectRequest;
};
