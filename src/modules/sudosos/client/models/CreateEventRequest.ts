/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateEventRequest = {
    /**
     * Name of the event.
     */
    name: string;
    /**
     * The starting date of the event.
     */
    startDate: string;
    /**
     * The end date of the event.
     */
    endDate: string;
    /**
     * The type of the event.
     */
    type?: string;
    /**
     * IDs of shifts that are in this event
 * per participant per borrel.
     */
    shiftIds: Array<number>;
};
