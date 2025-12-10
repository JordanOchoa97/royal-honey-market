// src/presentation/hooks/useRelatedProducts.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Product, ProductId } from '@/src/core/domain/entities/Product';
import { GetRelatedProductsUseCase } from '@/src/core/application/use-cases';
import { createMockProductRepository } from '@/src/infrastucture/repositories/ProductRepository.mock';

/**
 * 🎯 CUSTOM HOOK: useRelatedProducts
 * 
 * Para mostrar "También te puede interesar"
 */
const createGetRelatedProductsUseCase = () => {
  const repository = createMockProductRepository();
  return new GetRelatedProductsUseCase(repository);
};

interface UseRelatedProductsOptions {
  productId: ProductId | null;
  limit?: number;
  enabled?: boolean;
}

export function useRelatedProducts({ 
  productId, 
  limit = 4,
  enabled = true 
}: UseRelatedProductsOptions): UseQueryResult<readonly Product[], Error> {
  const useCase = createGetRelatedProductsUseCase();

  return useQuery({
    queryKey: ['related-products', productId?.value, limit],
    queryFn: () => {
      if (!productId) throw new Error('Product ID is required');
      return useCase.execute(productId, limit);
    },
    enabled: enabled && productId !== null,
    staleTime: 5 * 60 * 1000,
  });
}