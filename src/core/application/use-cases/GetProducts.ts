// src/core/application/use-cases/GetProducts.ts

import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ProductQuery, PaginatedProducts } from '../../domain/value-objects/ProductFilter';

/**
 * 🎯 USE CASE: Obtener lista de productos con filtros
 * 
 * CONCEPTOS:
 * 
 * 1. USE CASE PATTERN
 *    - Representa una acción del usuario
 *    - "Como usuario, quiero buscar productos con filtros"
 * 
 * 2. SINGLE RESPONSIBILITY
 *    - Solo se encarga de coordinar esta operación
 *    - No tiene lógica de negocio compleja
 * 
 * 3. DEPENDENCY INJECTION
 *    - Recibe el repository por constructor
 *    - No lo crea directamente (Inversion of Control)
 */
export class GetProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  /**
   * Ejecutar caso de uso
   * 
   * @param query - Filtros, ordenamiento y paginación
   * @returns Productos paginados
   */
  async execute(query: ProductQuery): Promise<PaginatedProducts> {
    // Validación básica
    if (query.page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (query.pageSize < 1 || query.pageSize > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    // Delegar al repositorio
    return this.productRepository.findAll(query);
  }
}