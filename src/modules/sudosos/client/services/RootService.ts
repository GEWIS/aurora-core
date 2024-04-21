/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RootService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Ping the backend to check whether everything is working correctly
     * @returns string Success
     * @throws ApiError
     */
    public ping(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/ping',
            errors: {
                500: `Internal server error (database error)`,
            },
        });
    }

}
