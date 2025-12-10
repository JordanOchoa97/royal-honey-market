// src/core/domain/value-objects/ProductFilter.ts

import { Product, ProductCategory, ProductStatus } from '../entities/Product';

/**
 * 🎯 VALUE OBJECT: PriceRange
 * 
 * Para filtrar productos por rango de precio
 */
export interface PriceRange {
  readonly min: number;
  readonly max: number;
}

/**
 * 🎯 VALUE OBJECT: ProductFilter
 * 
 * Representa todos los filtros posibles que se pueden aplicar
 * a una búsqueda de productos
 * 
 * PATRÓN: Builder Pattern implícito
 * - Todos los campos son opcionales
 * - Se pueden combinar libremente
 */
export interface ProductFilter {
  readonly categories?: readonly ProductCategory[];
  readonly priceRange?: PriceRange;
  readonly tags?: readonly string[];
  readonly searchQuery?: string;
  readonly minRating?: number;
  readonly status?: ProductStatus;
  readonly origin?: string;  // Filtrar por origen de la miel
  readonly inStock?: boolean; // Solo productos en stock
}

/**
 * 🎯 TYPE UNION: SortOption
 * 
 * Todas las formas posibles de ordenar productos
 */
export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'popularity-desc'
  | 'newest'
  | 'name-asc'
  | 'name-desc';

/**
 * 🎯 VALUE OBJECT: ProductQuery
 * 
 * Representa una consulta completa de productos con:
 * - Filtros
 * - Ordenamiento
 * - Paginación
 */
export interface ProductQuery {
  readonly filter?: ProductFilter;
  readonly sortBy?: SortOption;
  readonly page: number;
  readonly pageSize: number;
}

/**
 * 🎯 GENERIC TYPE: PaginatedResult<T>
 * 
 * Tipo genérico reutilizable para cualquier resultado paginado
 * 
 * CONCEPTO: TypeScript Generics
 * - T puede ser cualquier tipo (Product, User, Order, etc.)
 * - Reutilizable en toda la aplicación
 * - Type-safe: TypeScript sabe el tipo exacto de 'items'
 */
export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

/**
 * 🎯 TYPE ALIAS: Para mejor legibilidad
 */
export type PaginatedProducts = PaginatedResult<Product>;

/**
 * 🎯 HELPER: Crear resultado paginado
 * 
 * Función helper que calcula automáticamente hasNextPage, etc.
 */
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