// src/core/application/use-cases/GetProductById.ts

import { Product, ProductId } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

/**
 * 🎯 USE CASE: Obtener producto por ID
 */
export class GetProductByIdUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async execute(id: ProductId): Promise<Product> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new Error(`Product with id ${id.value} not found`);
    }

    return product;
  }
}