/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseTransactionResponse } from './BaseTransactionResponse';
import type { TransferResponse } from './TransferResponse';

export type FinancialMutationResponse = {
    /**
     * Type of mutation ('transfer' or 'transaction') (Optional)
     */
    type: FinancialMutationResponse.type;
    /**
     * Details of mutation, this can be either of type TransferResponse or BaseTransactionResponse
     */
    mutation?: (TransferResponse | BaseTransactionResponse);
};

export namespace FinancialMutationResponse {

    /**
     * Type of mutation ('transfer' or 'transaction') (Optional)
     */
    export enum type {
        TRANSFER = 'transfer',
        TRANSACTION = 'transaction',
    }


}
