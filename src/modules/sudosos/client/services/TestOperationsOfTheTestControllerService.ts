/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TestOperationsOfTheTestControllerService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get a beautiful Hello World email to your inbox
     * @returns void 
     * @throws ApiError
     */
    public helloworld(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/test/helloworld',
            errors: {
                500: `Internal server error`,
            },
        });
    }

}
