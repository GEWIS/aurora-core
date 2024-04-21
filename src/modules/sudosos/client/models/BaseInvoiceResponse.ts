/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { InvoiceStatusResponse } from './InvoiceStatusResponse';
import type { TransferResponse } from './TransferResponse';

export type BaseInvoiceResponse = (BaseResponse & {
/**
 * The person who was invoiced.
 */
to: BaseUserResponse;
/**
 * Name of the addressed.
 */
addressee: string;
/**
 * Description of the invoice.
 */
description: string;
/**
 * The current state of the invoice.
 */
currentState: InvoiceStatusResponse;
/**
 * Transfer linked to the invoice.
 */
transfer?: TransferResponse;
});
