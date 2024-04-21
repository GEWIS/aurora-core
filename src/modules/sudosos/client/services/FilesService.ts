/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileUpload } from '../models/FileUpload';
import type { SimpleFileResponse } from '../models/SimpleFileResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class FilesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Upload a file with the given name.
     * @returns SimpleFileResponse The uploaded file entity
     * @throws ApiError
     */
    public createFile({
formData,
}: {
/**
 * simple file
 */
formData: FileUpload,
}): CancelablePromise<SimpleFileResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/files',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Download a file with the given id.
     * @returns string The requested file
     * @throws ApiError
     */
    public getFile({
id,
}: {
/**
 * The id of the file which should be downloaded
 */
id: number,
}): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/files/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `File not found`,
                500: `Internal server error`,
            },
        });
    }

    /**
     * Delete the file with the given id.
     * @returns void 
     * @throws ApiError
     */
    public deleteFile({
id,
}: {
/**
 * The id of the file which should be deleted
 */
id: number,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/files/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `File not found`,
                500: `Internal server error`,
            },
        });
    }

}
