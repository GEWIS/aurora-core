/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PayoutRequestStatusRequest = {
    /**
     * PayoutRequestState to change to.
     */
    state?: PayoutRequestStatusRequest.state;
};

export namespace PayoutRequestStatusRequest {

    /**
     * PayoutRequestState to change to.
     */
    export enum state {
        CREATED = 'CREATED',
        APPROVED = 'APPROVED',
        DENIED = 'DENIED',
        CANCELLED = 'CANCELLED',
    }


}
