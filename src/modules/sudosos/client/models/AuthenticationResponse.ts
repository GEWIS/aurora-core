/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserResponse } from './UserResponse';

export type AuthenticationResponse = {
    /**
     * The user that has authenticated.
     */
    user: UserResponse;
    /**
     * The RBAC roles that the user has.
     */
    roles: Array<string>;
    /**
     * The organs that the user is a member of.
     */
    organs: Array<UserResponse>;
    /**
     * The JWT token that can be used as Bearer token for authentication.
     */
    token: string;
    /**
     * Whether the related user has accepted the Terms of Service
 * or is not required to.
     */
    acceptedToS: string;
};
