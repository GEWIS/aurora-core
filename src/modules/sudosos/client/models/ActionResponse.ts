/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RelationResponse } from './RelationResponse';

export type ActionResponse = {
    /**
     * The name of the action performed on the entity.
     */
    action: string;
    /**
     * The ownership relations with permissions.
     */
    relations: Array<RelationResponse>;
};
