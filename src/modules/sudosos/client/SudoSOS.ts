/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AuthenticateService } from './services/AuthenticateService';
import { BalanceService } from './services/BalanceService';
import { BannersService } from './services/BannersService';
import { ContainersService } from './services/ContainersService';
import { DebtorsService } from './services/DebtorsService';
import { EventsService } from './services/EventsService';
import { FilesService } from './services/FilesService';
import { InvoicesService } from './services/InvoicesService';
import { PayoutRequestsService } from './services/PayoutRequestsService';
import { PointofsaleService } from './services/PointofsaleService';
import { ProductCategoriesService } from './services/ProductCategoriesService';
import { ProductsService } from './services/ProductsService';
import { RbacService } from './services/RbacService';
import { RootService } from './services/RootService';
import { StripeService } from './services/StripeService';
import { TestOperationsOfTheTestControllerService } from './services/TestOperationsOfTheTestControllerService';
import { TransactionsService } from './services/TransactionsService';
import { TransfersService } from './services/TransfersService';
import { UsersService } from './services/UsersService';
import { VatGroupsService } from './services/VatGroupsService';
import { VouchergroupsService } from './services/VouchergroupsService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class SudoSOS {

    public readonly authenticate: AuthenticateService;
    public readonly balance: BalanceService;
    public readonly banners: BannersService;
    public readonly containers: ContainersService;
    public readonly debtors: DebtorsService;
    public readonly events: EventsService;
    public readonly files: FilesService;
    public readonly invoices: InvoicesService;
    public readonly payoutRequests: PayoutRequestsService;
    public readonly pointofsale: PointofsaleService;
    public readonly productCategories: ProductCategoriesService;
    public readonly products: ProductsService;
    public readonly rbac: RbacService;
    public readonly root: RootService;
    public readonly stripe: StripeService;
    public readonly testOperationsOfTheTestController: TestOperationsOfTheTestControllerService;
    public readonly transactions: TransactionsService;
    public readonly transfers: TransfersService;
    public readonly users: UsersService;
    public readonly vatGroups: VatGroupsService;
    public readonly vouchergroups: VouchergroupsService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://localhost:3001/v1',
            VERSION: config?.VERSION ?? '0.1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.authenticate = new AuthenticateService(this.request);
        this.balance = new BalanceService(this.request);
        this.banners = new BannersService(this.request);
        this.containers = new ContainersService(this.request);
        this.debtors = new DebtorsService(this.request);
        this.events = new EventsService(this.request);
        this.files = new FilesService(this.request);
        this.invoices = new InvoicesService(this.request);
        this.payoutRequests = new PayoutRequestsService(this.request);
        this.pointofsale = new PointofsaleService(this.request);
        this.productCategories = new ProductCategoriesService(this.request);
        this.products = new ProductsService(this.request);
        this.rbac = new RbacService(this.request);
        this.root = new RootService(this.request);
        this.stripe = new StripeService(this.request);
        this.testOperationsOfTheTestController = new TestOperationsOfTheTestControllerService(this.request);
        this.transactions = new TransactionsService(this.request);
        this.transfers = new TransfersService(this.request);
        this.users = new UsersService(this.request);
        this.vatGroups = new VatGroupsService(this.request);
        this.vouchergroups = new VouchergroupsService(this.request);
    }
}
