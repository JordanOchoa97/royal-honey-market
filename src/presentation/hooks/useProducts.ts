// src/presentation/hooks/useProducts.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ProductQuery, PaginatedProducts } from '@/src/core/domain/value-objects/ProductFilter';
import { GetProductsUseCase } from '@/src/core/application/use-cases';
import {createMockProductRepository} from '@/src/infrastucture/repositories/ProductRepository.mock';
/**
 * 🎯 CUSTOM HOOK: useProducts
 * 
 * CONCEPTOS:
 * 
 * 1. CUSTOM HOOKS PATTERN
 *    - Encapsula lógica reutilizable
 *    - Nombres empiezan con "use"
 *    - Pueden usar otros hooks
 * 
 * 2. REACT QUERY
 *    - Maneja caching automático
 *    - Loading y error states
 *    - Refetch automático
 *    - Optimistic updates
 * 
 * 3. DEPENDENCY INJECTION
 *    - Creamos el use case dentro del hook
 *    - En producción, podríamos usar Context para inyectarlo
 * 
 * 4. QUERY KEY
 *    - ['products', query] - React Query usa esto para cache
 *    - Si query cambia, refetch automático
 */

// 🏭 Factory: Crear el use case (en el futuro, esto vendría de un DI container)
const createGetProductsUseCase = () => {
  const repository = createMockProductRepository();
  return new GetProductsUseCase(repository);
};

interface UseProductsOptions {
  query: ProductQuery;
  enabled?: boolean; // Si false, no ejecuta la query
}

type UseProductsResult = UseQueryResult<PaginatedProducts, Error> & {
  products: PaginatedProducts['items'];
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Hook para obtener lista de productos con filtros
 * 
 * @example
 * ```tsx
 * const { products, isLoading, error } = useProducts({
 *   query: {
 *     page: 1,
 *     pageSize: 12,
 *     sortBy: 'price-asc',
 *     filter: { categories: ['raw-honey'] }
 *   }
 * });
 * ```
 */
export function useProducts({ 
  query, 
  enabled = true 
}: UseProductsOptions): UseProductsResult {
  const useCase = createGetProductsUseCase();

  const queryResult = useQuery({
    // 🔑 Query Key - Única para esta combinación de filtros
    queryKey: ['products', query],
    
    // 📡 Query Function - Función que obtiene los datos
    queryFn: () => useCase.execute(query),
    
    // ⚙️ Opciones
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos - datos se consideran frescos
    gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en cache después de no usarse
    retry: 2, // Reintentar 2 veces si falla
  });

  return {
    ...queryResult,
    products: queryResult.data?.items ?? [],
    total: queryResult.data?.total ?? 0,
    totalPages: queryResult.data?.totalPages ?? 0,
    hasNextPage: queryResult.data?.hasNextPage ?? false,
    hasPreviousPage: queryResult.data?.hasPreviousPage ?? false,
  };
}