/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseEventAnswerResponse } from '../models/BaseEventAnswerResponse';
import type { CreateEventRequest } from '../models/CreateEventRequest';
import type { CreateShiftRequest } from '../models/CreateShiftRequest';
import type { EventAnswerAssignmentRequest } from '../models/EventAnswerAssignmentRequest';
import type { EventAnswerAvailabilityRequest } from '../models/EventAnswerAvailabilityRequest';
import type { EventResponse } from '../models/EventResponse';
import type { EventShiftResponse } from '../models/EventShiftResponse';
import type { PaginatedBaseEventResponse } from '../models/PaginatedBaseEventResponse';
import type { PaginatedEventShiftResponse } from '../models/PaginatedEventShiftResponse';
import type { UpdateEventRequest } from '../models/UpdateEventRequest';
import type { UpdateShiftRequest } from '../models/UpdateShiftRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EventsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get all events
     * @returns PaginatedBaseEventResponse All existing events
     * @throws ApiError
     */
    public getAllEvents({
name,
createdById,
beforeDate,
afterDate,
type,
take,
skip,
}: {
/**
 * Name of the event
 */
name?: string,
/**
 * ID of user that created the event
 */
createdById?: number,
/**
 * Get only events that start after this date
 */
beforeDate?: string,
/**
 * Get only events that start before this date
 */
afterDate?: string,
/**
 * Get only events that are this type
 */
type?: string,
/**
 * How many entries the endpoint should return
 */
take?: number,
/**
 * How many entries should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedBaseEventResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/events',
            query: {
                'name': name,
                'createdById': createdById,
                'beforeDate': beforeDate,
                'afterDate': afterDate,
                'type': type,
                'take': take,
                'skip': skip,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Create an event with its corresponding answers objects
     * @returns EventResponse Created event
     * @throws ApiError
     */
    public createEvent({
requestBody,
}: {
requestBody: CreateEventRequest,
}): CancelablePromise<EventResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/events',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Get a single event with its answers and shifts
     * @returns EventResponse All existing events
     * @throws ApiError
     */
    public getSingleEvent({
id,
}: {
/**
 * The id of the event which should be returned
 */
id: number,
}): CancelablePromise<EventResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/events/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Update an event with its corresponding answers objects
     * @returns EventResponse Created event
     * @throws ApiError
     */
    public updateEvent({
id,
requestBody,
}: {
/**
 * The id of the event which should be returned
 */
id: number,
requestBody: UpdateEventRequest,
}): CancelablePromise<EventResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/events/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Delete an event with its answers
     * @returns void 
     * @throws ApiError
     */
    public deleteEvent({
id,
}: {
/**
 * The id of the event which should be deleted
 */
id: number,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/events/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Change the assignment of users to shifts on an event
     * @returns BaseEventAnswerResponse Created event
     * @throws ApiError
     */
    public assignEventShift({
eventId,
shiftId,
userId,
requestBody,
}: {
/**
 * The id of the event
 */
eventId: number,
/**
 * The id of the shift
 */
shiftId: number,
/**
 * The id of the user
 */
userId: number,
requestBody: EventAnswerAssignmentRequest,
}): CancelablePromise<BaseEventAnswerResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/events/{eventId}/shift/{shiftId}/user/{userId}/assign',
            path: {
                'eventId': eventId,
                'shiftId': shiftId,
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Update the availability of a user for a shift in an event
     * @returns BaseEventAnswerResponse Created event
     * @throws ApiError
     */
    public updateEventShiftAvailability({
eventId,
shiftId,
userId,
requestBody,
}: {
/**
 * The id of the event
 */
eventId: number,
/**
 * The id of the shift
 */
shiftId: number,
/**
 * The id of the user
 */
userId: number,
requestBody: EventAnswerAvailabilityRequest,
}): CancelablePromise<BaseEventAnswerResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/events/{eventId}/shift/{shiftId}/user/{userId}/availability',
            path: {
                'eventId': eventId,
                'shiftId': shiftId,
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Get all event shifts
     * @returns PaginatedEventShiftResponse All existing event shifts
     * @throws ApiError
     */
    public getAllEventShifts({
take,
skip,
}: {
/**
 * How many entries the endpoint should return
 */
take?: number,
/**
 * How many entries should be skipped (for pagination)
 */
skip?: number,
}): CancelablePromise<PaginatedEventShiftResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/eventshifts',
            query: {
                'take': take,
                'skip': skip,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Create an event shift
     * @returns EventShiftResponse Created event shift
     * @throws ApiError
     */
    public createEventShift({
requestBody,
}: {
requestBody: CreateShiftRequest,
}): CancelablePromise<EventShiftResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/eventshifts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Update an event shift
     * @returns EventShiftResponse Created event shift
     * @throws ApiError
     */
    public updateEventShift({
id,
requestBody,
}: {
/**
 * The id of the event which should be returned
 */
id: number,
requestBody: UpdateShiftRequest,
}): CancelablePromise<EventShiftResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/eventshifts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Delete an event shift with its answers
     * @returns void 
     * @throws ApiError
     */
    public deleteEventShift({
id,
}: {
/**
 * The id of the event which should be deleted
 */
id: number,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/eventshifts/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Get the number of times a user has been selected for the given shift
     * @returns PaginatedEventShiftResponse All existing event shifts
     * @throws ApiError
     */
    public getEventShiftCount({
id,
eventType,
afterDate,
beforeDate,
}: {
/**
 * The id of the event shift
 */
id: number,
/**
 * Only include events of this type
 */
eventType?: string,
/**
 * Only include events after this date
 */
afterDate?: string,
/**
 * Only include events before this date
 */
beforeDate?: string,
}): CancelablePromise<Array<PaginatedEventShiftResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/eventshifts/{id}/counts',
            path: {
                'id': id,
            },
            query: {
                'eventType': eventType,
                'afterDate': afterDate,
                'beforeDate': beforeDate,
            },
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

}
