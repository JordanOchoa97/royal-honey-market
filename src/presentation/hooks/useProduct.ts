// src/presentation/hooks/useProduct.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Product, ProductId } from '@/src/core/domain/entities/Product';
import { 
  GetProductByIdUseCase, 
  GetProductBySlugUseCase 
} from '@/src/core/application/use-cases';
import { createMockProductRepository } from '@/src/infrastucture/repositories/ProductRepository.mock';

/**
 * 🎯 CUSTOM HOOK: useProduct (por ID)
 */
const createGetProductByIdUseCase = () => {
  const repository = createMockProductRepository();
  return new GetProductByIdUseCase(repository);
};

interface UseProductByIdOptions {
  id: ProductId | null;
  enabled?: boolean;
}

export function useProductById({ 
  id, 
  enabled = true 
}: UseProductByIdOptions): UseQueryResult<Product, Error> {
  const useCase = createGetProductByIdUseCase();

  return useQuery({
    queryKey: ['product', id?.value],
    queryFn: () => {
      if (!id) throw new Error('Product ID is required');
      return useCase.execute(id);
    },
    enabled: enabled && id !== null,
    staleTime: 10 * 60 * 1000, // 10 minutos - producto individual cambia menos
  });
}

/**
 * 🎯 CUSTOM HOOK: useProduct (por Slug)
 * 
 * Útil para URLs amigables:
 * /products/raw-organic-wildflower-honey
 */
const createGetProductBySlugUseCase = () => {
  const repository = createMockProductRepository();
  return new GetProductBySlugUseCase(repository);
};

interface UseProductBySlugOptions {
  slug: string | null;
  enabled?: boolean;
}

export function useProductBySlug({ 
  slug, 
  enabled = true 
}: UseProductBySlugOptions): UseQueryResult<Product, Error> {
  const useCase = createGetProductBySlugUseCase();

  return useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: () => {
      if (!slug) throw new Error('Product slug is required');
      return useCase.execute(slug);
    },
    enabled: enabled && slug !== null,
    staleTime: 10 * 60 * 1000,
  });
}