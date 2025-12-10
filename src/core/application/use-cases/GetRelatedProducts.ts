// src/core/application/use-cases/GetRelatedProducts.ts

import { Product, ProductId } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

/**
 * 🎯 USE CASE: Obtener productos relacionados
 */
export class GetRelatedProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async execute(productId: ProductId, limit: number = 4): Promise<readonly Product[]> {
    if (limit < 1 || limit > 20) {
      throw new Error('Limit must be between 1 and 20');
    }

    return this.productRepository.findRelated(productId, limit);
  }
}