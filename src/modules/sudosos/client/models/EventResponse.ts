/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseEventResponse } from './BaseEventResponse';
import type { EventInShiftResponse } from './EventInShiftResponse';

export type EventResponse = (BaseEventResponse & {
/**
 * Shifts for this event
 */
shifts: Array<EventInShiftResponse>;
});
