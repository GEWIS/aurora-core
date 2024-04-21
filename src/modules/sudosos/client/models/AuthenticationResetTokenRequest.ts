/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AuthenticationResetTokenRequest = {
    /**
     * The mail of the user
     */
    accountMail: string;
    /**
     * The reset token passcode
     */
    token: string;
    /**
     * The new password to set
     */
    password: string;
};
