/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseVatGroupResponse } from './BaseVatGroupResponse';
import type { DineroObjectResponse } from './DineroObjectResponse';

export type TransactionReportVatEntryResponse = {
    /**
     * The vat group of this entry
     */
    vat: BaseVatGroupResponse;
    /**
     * The price of this entry incl. vat
     */
    totalInclVat: DineroObjectResponse;
    /**
     * The price of this entry excl. vat
     */
    totalExclVat: DineroObjectResponse;
};
