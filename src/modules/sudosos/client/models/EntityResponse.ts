/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionResponse } from './ActionResponse';

export type EntityResponse = {
    /**
     * The name of the entity for which the permissions are.
     */
    entity: string;
    /**
     * The permissions per action.
     */
    actions: Array<ActionResponse>;
};
