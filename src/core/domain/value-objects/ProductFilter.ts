import { Product, ProductCategory, ProductStatus } from '../entities/Product';

export interface PriceRange {
  readonly min: number;
  readonly max: number;
}

export interface ProductFilter {
  readonly categories?: readonly ProductCategory[];
  readonly priceRange?: PriceRange;
  readonly tags?: readonly string[];
  readonly searchQuery?: string;
  readonly minRating?: number;
  readonly status?: ProductStatus;
  readonly origin?: string;
  readonly inStock?: boolean;
}

export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'popularity-desc'
  | 'newest'
  | 'name-asc'
  | 'name-desc';

export interface ProductQuery {
  readonly filter?: ProductFilter;
  readonly sortBy?: SortOption;
  readonly page: number;
  readonly pageSize: number;
}

export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export type PaginatedProducts = PaginatedResult<Product>;

export function createPaginatedResult<T>(
  items: readonly T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}