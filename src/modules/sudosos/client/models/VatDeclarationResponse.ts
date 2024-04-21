/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VatDeclarationRow } from './VatDeclarationRow';

export type VatDeclarationResponse = {
    /**
     * Calendar year of this result table
     */
    calendarYear: number;
    /**
     * The used VAT declaration period the rows below are based upon
     */
    period: string;
    /**
     * The rows of the result table
     */
    rows: Array<VatDeclarationRow>;
};
