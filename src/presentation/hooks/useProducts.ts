import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { ProductQuery, PaginatedProducts } from '@/src/core/domain/value-objects/ProductFilter';
import { GetProductsUseCase } from '@/src/core/application/use-cases';
import {createMockProductRepository} from '@/src/infrastucture/repositories/ProductRepository.mock';
import { useEffect } from 'react';
const createGetProductsUseCase = () => {
  const repository = createMockProductRepository();
  return new GetProductsUseCase(repository);
};

interface UseProductsOptions {
  query: ProductQuery;
  enabled?: boolean;
}

type UseProductsResult = UseQueryResult<PaginatedProducts, Error> & {
  products: PaginatedProducts['items'];
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function useProducts({ 
  query, 
  enabled = true 
}: UseProductsOptions): UseProductsResult {
  const useCase = createGetProductsUseCase();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['products', query],
    queryFn: () => useCase.execute(query),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    const hasNextPage = queryResult.data?.hasNextPage;
    
    if (hasNextPage && !queryResult.isLoading) {
      const nextPage = query.page + 1;
      const nextQuery = { ...query, page: nextPage };

      queryClient.prefetchQuery({
        queryKey: ['products', nextQuery],
        queryFn: () => useCase.execute(nextQuery),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [query, queryResult.data?.hasNextPage, queryResult.isLoading, queryClient]);

  return {
    ...queryResult,
    products: queryResult.data?.items ?? [],
    total: queryResult.data?.total ?? 0,
    totalPages: queryResult.data?.totalPages ?? 0,
    hasNextPage: queryResult.data?.hasNextPage ?? false,
    hasPreviousPage: queryResult.data?.hasPreviousPage ?? false,
  };
}