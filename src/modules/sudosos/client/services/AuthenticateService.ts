/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthenticationEanRequest } from '../models/AuthenticationEanRequest';
import type { AuthenticationKeyRequest } from '../models/AuthenticationKeyRequest';
import type { AuthenticationLDAPRequest } from '../models/AuthenticationLDAPRequest';
import type { AuthenticationLocalRequest } from '../models/AuthenticationLocalRequest';
import type { AuthenticationMockRequest } from '../models/AuthenticationMockRequest';
import type { AuthenticationNfcRequest } from '../models/AuthenticationNfcRequest';
import type { AuthenticationPinRequest } from '../models/AuthenticationPinRequest';
import type { AuthenticationResetTokenRequest } from '../models/AuthenticationResetTokenRequest';
import type { AuthenticationResponse } from '../models/AuthenticationResponse';
import type { GEWISAuthenticationPinRequest } from '../models/GEWISAuthenticationPinRequest';
import type { GewiswebAuthenticationRequest } from '../models/GewiswebAuthenticationRequest';
import type { ResetLocalRequest } from '../models/ResetLocalRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthenticateService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * PIN login and hand out token
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public pinAuthentication({
requestBody,
}: {
/**
 * The PIN login.
 */
requestBody: AuthenticationPinRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/pin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
                403: `Authentication error.`,
            },
        });
    }

    /**
     * LDAP login and hand out token
 * If user has never signed in before this also creates an account.
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public ldapAuthentication({
requestBody,
}: {
/**
 * The LDAP login.
 */
requestBody: AuthenticationLDAPRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/LDAP',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
                403: `Authentication error.`,
            },
        });
    }

    /**
     * Local login and hand out token
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public localAuthentication({
requestBody,
}: {
/**
 * The local login.
 */
requestBody: AuthenticationLocalRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/local',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
                403: `Authentication error.`,
            },
        });
    }

    /**
     * Reset local authentication using the provided token
     * @returns void 
     * @throws ApiError
     */
    public resetLocalWithToken({
requestBody,
}: {
/**
 * The reset token.
 */
requestBody: AuthenticationResetTokenRequest,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/authentication/local',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Authentication error.`,
            },
        });
    }

    /**
     * Creates a reset token for the local authentication
     * @returns void 
     * @throws ApiError
     */
    public resetLocal({
requestBody,
}: {
/**
 * The reset info.
 */
requestBody: ResetLocalRequest,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/local/reset',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * NFC login and hand out token
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public nfcAuthentication({
requestBody,
}: {
/**
 * The NFC login.
 */
requestBody: AuthenticationNfcRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/nfc',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Authentication error.`,
            },
        });
    }

    /**
     * EAN login and hand out token
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public eanAuthentication({
requestBody,
}: {
/**
 * The EAN login.
 */
requestBody: AuthenticationEanRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/ean',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Authentication error.`,
            },
        });
    }

    /**
     * Key login and hand out token.
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public keyAuthentication({
requestBody,
}: {
/**
 * The key login.
 */
requestBody: AuthenticationKeyRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/key',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
                403: `Authentication error.`,
            },
        });
    }

    /**
     * Mock login and hand out token.
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public mockAuthentication({
requestBody,
}: {
/**
 * The mock login.
 */
requestBody: AuthenticationMockRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/mock',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
            },
        });
    }

    /**
     * Get a new JWT token, lesser if the existing token is also lesser
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public refreshToken(): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/authentication/refreshToken',
        });
    }

    /**
     * GEWIS login verification based on gewisweb JWT tokens.
 * This method verifies the validity of the gewisweb JWT token, and returns a SudoSOS
 * token if the GEWIS token is valid.
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public gewisWebAuthentication({
requestBody,
}: {
/**
 * The mock login.
 */
requestBody: GewiswebAuthenticationRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/gewisweb',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
                403: `The created json web token.`,
            },
        });
    }

    /**
     * LDAP login and hand out token
 * If user has never signed in before this also creates an GEWIS account.
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public gewisLdapAuthentication({
requestBody,
}: {
/**
 * The LDAP login.
 */
requestBody: AuthenticationLDAPRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/GEWIS/LDAP',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
                403: `Authentication error.`,
            },
        });
    }

    /**
     * PIN login and hand out token.
     * @returns AuthenticationResponse The created json web token.
     * @throws ApiError
     */
    public gewisPinAuthentication({
requestBody,
}: {
/**
 * The PIN login.
 */
requestBody: GEWISAuthenticationPinRequest,
}): CancelablePromise<AuthenticationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/GEWIS/pin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error.`,
                403: `Authentication error.`,
            },
        });
    }

}
