/**
 * Shared domain types. Concrete shapes (Product, Order, etc.) land in
 * dedicated files in Sprint 02 once schemas are defined.
 */
export type ID = string;

export type ISODate = string;

export interface Money {
  amount: number;
  currency: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
