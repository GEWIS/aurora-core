/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StripePaymentIntentResponse } from '../models/StripePaymentIntentResponse';
import type { StripeRequest } from '../models/StripeRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class StripeService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Start the stripe deposit flow
     * @returns StripePaymentIntentResponse Payment Intent information
     * @throws ApiError
     */
    public deposit({
requestBody,
}: {
/**
 * The deposit that should be created
 */
requestBody: StripeRequest,
}): CancelablePromise<StripePaymentIntentResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/stripe/deposit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal server error`,
            },
        });
    }

}
