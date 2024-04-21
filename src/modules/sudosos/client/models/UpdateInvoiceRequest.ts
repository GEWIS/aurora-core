/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateInvoiceRequest = {
    /**
     * The user who updates the Invoice, defaults to the ID of the requester.
     */
    byId?: number;
    /**
     * Name of the addressed.
     */
    addressee: string;
    /**
     * The description of the invoice.
     */
    description: string;
    /**
     * The state to set of the invoice,
     */
    state?: UpdateInvoiceRequest.state;
};

export namespace UpdateInvoiceRequest {

    /**
     * The state to set of the invoice,
     */
    export enum state {
        CREATED = 'CREATED',
        SENT = 'SENT',
        PAID = 'PAID',
        DELETED = 'DELETED',
    }


}
