/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseFineHandoutEventResponse } from './BaseFineHandoutEventResponse';
import type { FineResponse } from './FineResponse';

export type FineHandoutEventResponse = (BaseFineHandoutEventResponse & {
/**
 * Fines that have been handed out
 */
fines: Array<FineResponse>;
});
