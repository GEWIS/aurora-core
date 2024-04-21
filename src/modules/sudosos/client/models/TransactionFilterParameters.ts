/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TransactionFilterParameters = {
    transactionId?: Array<number>;
    fromId?: number;
    createdById?: number;
    toId?: number;
    exclusiveToId?: boolean;
    pointOfSaleId?: number;
    pointOfSaleRevision?: number;
    containerId?: number;
    containerRevision?: number;
    productId?: number;
    productRevision?: number;
    fromDate?: string;
    tillDate?: string;
    invoiceId?: number;
};
