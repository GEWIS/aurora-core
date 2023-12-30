/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Color } from './Color';
import type { TrelloID } from './TrelloID';

export type Attachment = {
    id?: TrelloID;
    bytes?: string | null;
    date?: string;
    edgeColor?: Color | null;
    idMember?: TrelloID;
    isUpload?: boolean;
    mimeType?: string;
    name?: string;
    previews?: Array<string>;
    url?: string;
    pos?: number;
};
