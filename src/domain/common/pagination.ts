export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
}
