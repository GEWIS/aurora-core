/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseUserResponse } from './BaseUserResponse';

export type BaseEventAnswerResponse = {
    /**
     * Participant that filled in their availability
     */
    user: BaseUserResponse;
    /**
     * Filled in availability per slot.
     */
    availability?: string;
    /**
     * Whether this user is selected for the shift in the event
     */
    selected: boolean;
};
