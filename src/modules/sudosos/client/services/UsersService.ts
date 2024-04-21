/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcceptTosRequest } from '../models/AcceptTosRequest';
import type { AuthenticationResponse } from '../models/AuthenticationResponse';
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { PaginatedBaseTransactionResponse } from '../models/PaginatedBaseTransactionResponse';
import type { PaginatedContainerResponse } from '../models/PaginatedContainerResponse';
import type { PaginatedFinancialMutationResponse } from '../models/PaginatedFinancialMutationResponse';
import type { PaginatedPointOfSaleResponse } from '../models/PaginatedPointOfSaleResponse';
import type { PaginatedProductResponse } from '../models/PaginatedProductResponse';
import type { PaginatedTransferResponse } from '../models/PaginatedTransferResponse';
import type { PaginatedUserResponse } from '../models/PaginatedUserResponse';
import type { RoleResponse } from '../models/RoleResponse';
import type { TransactionReportResponse } from '../models/TransactionReportResponse';
import type { UpdateKeyResponse } from '../models/UpdateKeyResponse';
import type { UpdateLocalRequest } from '../models/UpdateLocalRequest';
import type { UpdateNfcRequest } from '../models/UpdateNfcRequest';
import type { UpdatePinRequest } from '../models/UpdatePinRequest';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { UserResponse } from '../models/UserResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get a list of all users
   * @returns PaginatedUserResponse A list of all users
   * @throws ApiError
   */
  public getAllUsers({
    take,
    skip,
    search,
    active,
    ofAge,
    id,
    type,
  }: {
    /**
     * How many users the endpoint should return
     */
    take?: number;
    /**
     * How many users should be skipped (for pagination)
     */
    skip?: number;
    /**
     * Filter based on first name
     */
    search?: string;
    /**
     * Filter based if the user is active
     */
    active?: boolean;
    /**
     * Filter based if the user is 18+
     */
    ofAge?: boolean;
    /**
     * Filter based on user ID
     */
    id?: number;
    /**
     * Filter based on user type.
     */
    type?:
      | 'MEMBER'
      | 'ORGAN'
      | 'VOUCHER'
      | 'LOCAL_USER'
      | 'LOCAL_ADMIN'
      | 'INVOICE'
      | 'AUTOMATIC_INVOICE';
  }): CancelablePromise<PaginatedUserResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users',
      query: {
        take: take,
        skip: skip,
        search: search,
        active: active,
        ofAge: ofAge,
        id: id,
        type: type,
      },
    });
  }

  /**
   * Create a new user
   * @returns UserResponse New user
   * @throws ApiError
   */
  public createUser({
    requestBody,
  }: {
    /**
     * The user which should be created
     */
    requestBody: CreateUserRequest;
  }): CancelablePromise<UserResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
      },
    });
  }

  /**
   * Get all users of user type
   * @returns PaginatedUserResponse A list of all users
   * @throws ApiError
   */
  public getAllUsersOfUserType({
    userType,
    take,
    skip,
  }: {
    /**
     * The userType of the requested users
     */
    userType: string;
    /**
     * How many users the endpoint should return
     */
    take?: number;
    /**
     * How many users should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<PaginatedUserResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/usertype/{userType}',
      path: {
        userType: userType,
      },
      query: {
        take: take,
        skip: skip,
      },
      errors: {
        404: `Nonexistent usertype`,
      },
    });
  }

  /**
   * Put an users pin code
   * @returns void
   * @throws ApiError
   */
  public updateUserPin({
    id,
    requestBody,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     *    The PIN code to update to
     */
    requestBody: UpdatePinRequest;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/users/{id}/authenticator/pin',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Validation Error`,
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * Put a users NFC code
   * @returns void
   * @throws ApiError
   */
  public updateUserNfc({
    id,
    requestBody,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     *    The NFC code to update to
     */
    requestBody: UpdateNfcRequest;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/users/{id}/authenticator/nfc',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Validation Error`,
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * Delete a nfc code
   * @returns any Delete nfc success
   * @throws ApiError
   */
  public deleteUserNfc({
    id,
  }: {
    /**
     * The id of the user
     */
    id: number;
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/users/{id}/authenticator/nfc',
      path: {
        id: id,
      },
      errors: {
        400: `Validation Error`,
        403: `Nonexistent user nfc`,
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * POST an users update to new key code
   * @returns UpdateKeyResponse The new key
   * @throws ApiError
   */
  public updateUserKey({
    id,
  }: {
    /**
     * The id of the user
     */
    id: number;
  }): CancelablePromise<UpdateKeyResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users/{id}/authenticator/key',
      path: {
        id: id,
      },
      errors: {
        400: `Validation Error`,
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * Delete a users key code
   * @returns any Deletion succesfull
   * @throws ApiError
   */
  public deleteUserKey({
    id,
  }: {
    /**
     * The id of the user
     */
    id: number;
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/users/{id}/authenticator/key',
      path: {
        id: id,
      },
      errors: {
        400: `Validation Error`,
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * Put a user's local password
   * @returns void
   * @throws ApiError
   */
  public updateUserLocalPassword({
    id,
    requestBody,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     *    The password update
     */
    requestBody: UpdateLocalRequest;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/users/{id}/authenticator/local',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Validation Error`,
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * Get an organs members
   * @returns PaginatedUserResponse All members of the organ
   * @throws ApiError
   */
  public getOrganMembers({
    id,
    take,
    skip,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     * How many members the endpoint should return
     */
    take?: number;
    /**
     * How many members should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<PaginatedUserResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/members',
      path: {
        id: id,
      },
      query: {
        take: take,
        skip: skip,
      },
      errors: {
        400: `User is not an organ`,
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * Get an individual user
   * @returns UserResponse Individual user
   * @throws ApiError
   */
  public getIndividualUser({
    id,
  }: {
    /**
     * userID
     */
    id: number;
  }): CancelablePromise<UserResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `Nonexistent user id`,
      },
    });
  }

  /**
   * Update a user
   * @returns UserResponse New user
   * @throws ApiError
   */
  public updateUser({
    id,
    requestBody,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     * The user which should be updated
     */
    requestBody: UpdateUserRequest;
  }): CancelablePromise<UserResponse> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/users/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
      },
    });
  }

  /**
   * Delete a single user
   * @returns void
   * @throws ApiError
   */
  public deleteUser({
    id,
  }: {
    /**
     * The id of the user
     */
    id: number;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/users/{id}',
      path: {
        id: id,
      },
      errors: {
        400: `Cannot delete yourself`,
      },
    });
  }

  /**
   * Accept the Terms of Service if you have not accepted it yet
   * @returns void
   * @throws ApiError
   */
  public acceptTos({
    requestBody,
  }: {
    /**
     * "Tosrequest body"
     */
    requestBody: AcceptTosRequest;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users/acceptTos',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `ToS already accepted`,
      },
    });
  }

  /**
   * Get an user's products
   * @returns PaginatedProductResponse List of products.
   * @throws ApiError
   */
  public getUsersProducts({
    id,
    take,
    skip,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     * How many products the endpoint should return
     */
    take?: number;
    /**
     * How many products should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<PaginatedProductResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/products',
      path: {
        id: id,
      },
      query: {
        take: take,
        skip: skip,
      },
    });
  }

  /**
   * Returns the user's containers
   * @returns PaginatedContainerResponse All users updated containers
   * @throws ApiError
   */
  public getUsersContainers({
    id,
    take,
    skip,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     * How many containers the endpoint should return
     */
    take?: number;
    /**
     * How many containers should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<PaginatedContainerResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/containers',
      path: {
        id: id,
      },
      query: {
        take: take,
        skip: skip,
      },
      errors: {
        404: `Not found error`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * Returns the user's Points of Sale
   * @returns PaginatedPointOfSaleResponse All users updated point of sales
   * @throws ApiError
   */
  public getUsersPointsOfSale({
    id,
    take,
    skip,
  }: {
    /**
     * The id of the user
     */
    id: number;
    /**
     * How many points of sale the endpoint should return
     */
    take?: number;
    /**
     * How many points of sale should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<PaginatedPointOfSaleResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/pointsofsale',
      path: {
        id: id,
      },
      query: {
        take: take,
        skip: skip,
      },
      errors: {
        404: `Not found error`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * Get an user's transactions (from, to or created)
   * @returns PaginatedBaseTransactionResponse List of transactions.
   * @throws ApiError
   */
  public getUsersTransactions({
    id,
    fromId,
    createdById,
    toId,
    productId,
    productRevision,
    fromDate,
    tillDate,
    take,
    skip,
  }: {
    /**
     * The id of the user that should be involved
     * in all returned transactions
     */
    id: number;
    /**
     * From-user for selected transactions
     */
    fromId?: number;
    /**
     * User that created selected transaction
     */
    createdById?: number;
    /**
     * To-user for selected transactions
     * transactions. Requires ContainerId
     */
    toId?: number;
    /**
     * Product ID for selected transactions
     */
    productId?: number;
    /**
     * Product Revision for selected
     * transactions. Requires ProductID
     */
    productRevision?: number;
    /**
     * Start date for selected transactions (inclusive)
     */
    fromDate?: string;
    /**
     * End date for selected transactions (exclusive)
     */
    tillDate?: string;
    /**
     * How many transactions the endpoint should return
     */
    take?: number;
    /**
     * How many transactions should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<PaginatedBaseTransactionResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/transactions',
      path: {
        id: id,
      },
      query: {
        fromId: fromId,
        createdById: createdById,
        toId: toId,
        productId: productId,
        productRevision: productRevision,
        fromDate: fromDate,
        tillDate: tillDate,
        take: take,
        skip: skip,
      },
    });
  }

  /**
   * Get an user's transfers
   * @returns PaginatedTransferResponse List of transfers.
   * @throws ApiError
   */
  public getUsersTransfers({
    id,
    take,
    skip,
    fromId,
    toId,
    transferId,
  }: {
    /**
     * The id of the user that should be involved
     * in all returned transfers
     */
    id: number;
    /**
     * How many transfers the endpoint should return
     */
    take?: number;
    /**
     * How many transfers should be skipped (for pagination)
     */
    skip?: number;
    /**
     * From-user for selected transfers
     */
    fromId?: number;
    /**
     * To-user for selected transfers
     */
    toId?: number;
    /**
     * ID of selected transfers
     */
    transferId?: number;
  }): CancelablePromise<PaginatedTransferResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/transfers',
      path: {
        id: id,
      },
      query: {
        take: take,
        skip: skip,
        fromId: fromId,
        toId: toId,
        id: transferId,
      },
    });
  }

  /**
   * Authenticate as another user
   * @returns AuthenticationResponse The created json web token.
   * @throws ApiError
   */
  public authenticateAs({
    id,
  }: {
    /**
     * The id of the user that should be authenticated as
     */
    id: number;
  }): CancelablePromise<AuthenticationResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users/{id}/authenticate',
      path: {
        id: id,
      },
      errors: {
        400: `Validation error.`,
        403: `Authentication error.`,
        404: `User not found error.`,
      },
    });
  }

  /**
   * Get all users that the user can authenticate as
   * @returns UserResponse A list of all users the given ID can authenticate
   * @throws ApiError
   */
  public getUserAuthenticatable({
    id,
  }: {
    /**
     * The id of the user to get authentications of
     */
    id: number;
  }): CancelablePromise<Array<UserResponse>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/authenticate',
      path: {
        id: id,
      },
      errors: {
        404: `User not found error.`,
      },
    });
  }

  /**
   * Get all roles assigned to the user.
   * @returns RoleResponse The roles of the user
   * @throws ApiError
   */
  public getUserRoles({
    id,
  }: {
    /**
     * The id of the user to get the roles from
     */
    id: number;
  }): CancelablePromise<Array<RoleResponse>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/roles',
      path: {
        id: id,
      },
      errors: {
        404: `User not found error.`,
      },
    });
  }

  /**
   * Get all financial mutations of a user.
   * @returns PaginatedFinancialMutationResponse The financial mutations of the user
   * @throws ApiError
   */
  public getUsersFinancialMutations({
    id,
    take,
    skip,
  }: {
    /**
     * The id of the user to get the mutations from
     */
    id: number;
    /**
     * How many transactions the endpoint should return
     */
    take?: number;
    /**
     * How many transactions should be skipped (for pagination)
     */
    skip?: number;
  }): CancelablePromise<PaginatedFinancialMutationResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/financialmutations',
      path: {
        id: id,
      },
      query: {
        take: take,
        skip: skip,
      },
      errors: {
        404: `User not found error.`,
      },
    });
  }

  /**
   * Get all deposits of a user that are still being processed by Stripe
   * @returns RoleResponse The processing deposits of a user
   * @throws ApiError
   */
  public getUsersProcessingDeposits({
    id,
  }: {
    /**
     * The id of the user to get the deposits from
     */
    id: number;
  }): CancelablePromise<Array<RoleResponse>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/deposits',
      path: {
        id: id,
      },
      errors: {
        404: `User not found error.`,
      },
    });
  }

  /**
   * Get transaction report for the given user
   * @returns TransactionReportResponse The transaction report of the user
   * @throws ApiError
   */
  public getUsersTransactionsReport({
    id,
    fromDate,
    tillDate,
    fromId,
    toId,
    exclusiveToId,
  }: {
    /**
     * The id of the user to get the transaction report from
     */
    id: number;
    /**
     * Start date for selected transactions (inclusive)
     */
    fromDate?: string;
    /**
     * End date for selected transactions (exclusive)
     */
    tillDate?: string;
    /**
     * From-user for selected transactions
     */
    fromId?: number;
    /**
     * To-user for selected transactions
     */
    toId?: number;
    /**
     * If all sub-transactions should be to the toId user, default true
     */
    exclusiveToId?: boolean;
  }): CancelablePromise<Array<TransactionReportResponse>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}/transactions/report',
      path: {
        id: id,
      },
      query: {
        fromDate: fromDate,
        tillDate: tillDate,
        fromId: fromId,
        toId: toId,
        exclusiveToId: exclusiveToId,
      },
      errors: {
        404: `User not found error.`,
      },
    });
  }

  /**
   * Waive all given user's fines
   * @returns void
   * @throws ApiError
   */
  public waiveUserFines({
    id,
  }: {
    /**
     * The id of the user
     */
    id: number;
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users/{id}/fines/waive',
      path: {
        id: id,
      },
      errors: {
        400: `User has no fines.`,
        404: `User not found error.`,
      },
    });
  }
}
