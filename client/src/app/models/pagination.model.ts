import { ApiResponse } from './api-response.model';

export interface Pagination {
  currentPage: number;
  itemPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginationResult<T> implements ApiResponse<T> {
  message?: string;
  status?: boolean;
  data: T = Object();
  pagination?: Pagination;
}
