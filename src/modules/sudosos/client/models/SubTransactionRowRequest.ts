/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectRequest } from './DineroObjectRequest';
import type { RevisionRequest } from './RevisionRequest';

export type SubTransactionRowRequest = {
    /**
     * product
     */
    product?: RevisionRequest;
    /**
     * amount of this product in subtransaction
     */
    amount?: number;
    /**
     * total price
 * of the subtransaction row
     */
    totalPriceInclVat: DineroObjectRequest;
};
