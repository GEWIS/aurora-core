/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseUserResponse } from './BaseUserResponse';

export type InvoiceStatusResponse = {
    /**
     * The user that changed the invoice status.
     */
    changedBy: BaseUserResponse;
    /**
     * The state of the invoice
     */
    state: InvoiceStatusResponse.state;
};

export namespace InvoiceStatusResponse {

    /**
     * The state of the invoice
     */
    export enum state {
        CREATED = 'CREATED',
        SENT = 'SENT',
        PAID = 'PAID',
        DELETED = 'DELETED',
    }


}
