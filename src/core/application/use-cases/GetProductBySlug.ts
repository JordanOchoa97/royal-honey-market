// src/core/application/use-cases/GetProductBySlug.ts

import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

/**
 * 🎯 USE CASE: Obtener producto por slug
 */
export class GetProductBySlugUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async execute(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);
    
    if (!product) {
      throw new Error(`Product with slug "${slug}" not found`);
    }

    return product;
  }
}