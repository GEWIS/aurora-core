/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';
import type { RevisionRequest } from './RevisionRequest';
import type { SubTransactionRowRequest } from './SubTransactionRowRequest';

export type SubTransactionRequest = {
    /**
     * to user id
     */
    to: number;
    /**
     * container
     */
    container: RevisionRequest;
    /**
     * subtransaction rows
     */
    subTransactionRows: Array<SubTransactionRowRequest>;
    /**
     * total price
 * of the subtransaction
     */
    totalPriceInclVat: DineroObjectRequest;
};
