/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoleResponse } from '../models/RoleResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RbacService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns all existing roles
     * @returns RoleResponse All existing roles
     * @throws ApiError
     */
    public getAllRoles(): CancelablePromise<Array<RoleResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/rbac/roles',
            errors: {
                500: `Internal server error`,
            },
        });
    }

}
