/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityResponse } from './EntityResponse';

export type RoleResponse = {
    /**
     * The name of the role.
     */
    role: string;
    /**
     * The permissions with regards to the entity.
     */
    entities: Array<EntityResponse>;
};
