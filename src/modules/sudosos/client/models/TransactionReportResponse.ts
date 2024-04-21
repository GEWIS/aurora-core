/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DineroObjectResponse } from './DineroObjectResponse';
import type { TransactionFilterParameters } from './TransactionFilterParameters';
import type { TransactionReportDataResponse } from './TransactionReportDataResponse';

export type TransactionReportResponse = {
    /**
     * The parameters used for the report
     */
    parameters: TransactionFilterParameters;
    /**
     * The data that makes up the report
     */
    data: TransactionReportDataResponse;
    /**
     * The total amount of money excl. vat of this report
     */
    totalExclVat: DineroObjectResponse;
    /**
     * The total amount of money inc. vat of this report
     */
    totalInclVat: DineroObjectResponse;
};
