/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseInvoiceResponse } from './BaseInvoiceResponse';
import type { BasePayoutRequestResponse } from './BasePayoutRequestResponse';
import type { BaseResponse } from './BaseResponse';
import type { BaseUserResponse } from './BaseUserResponse';
import type { Dinero } from './Dinero';
import type { FineResponse } from './FineResponse';
import type { StripeDepositResponse } from './StripeDepositResponse';
import type { UserFineGroupResponse } from './UserFineGroupResponse';

export type TransferResponse = (BaseResponse & {
/**
 * Description of the transfer
 */
description: string;
/**
 * Amount of money being transferred
 */
amount: Dinero;
/**
 * from which user the money is being transferred
 */
from?: BaseUserResponse;
/**
 * to which user the money is being transferred.
 */
to?: BaseUserResponse;
/**
 * invoice belonging to this transfer
 */
invoice?: BaseInvoiceResponse;
/**
 * deposit belonging to this transfer
 */
deposit?: StripeDepositResponse;
/**
 * payout request belonging to this transfer
 */
payoutRequest?: BasePayoutRequestResponse;
/**
 * fine belonging to this transfer
 */
fine?: FineResponse;
/**
 * fines that have been waived by this transfer
 */
waivedFines?: UserFineGroupResponse;
});
