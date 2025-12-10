// src/core/domain/repositories/IProductRepository.ts

import { Product, ProductId, ProductCategory } from '../entities/Product';
import { ProductQuery, PaginatedProducts } from '../value-objects/ProductFilter';

/**
 * 🎯 INTERFACE: IProductRepository (Puerto en Arquitectura Hexagonal)
 * 
 * CONCEPTOS CLAVE:
 * 
 * 1. DEPENDENCY INVERSION PRINCIPLE (SOLID)
 *    - El dominio define la interfaz
 *    - La infraestructura la implementa
 *    - El dominio NO depende de la infraestructura
 * 
 * 2. REPOSITORY PATTERN
 *    - Abstrae el acceso a datos
 *    - El dominio no sabe si los datos vienen de:
 *      * API REST
 *      * GraphQL
 *      * LocalStorage
 *      * Mock data
 * 
 * 3. ASYNC/AWAIT
 *    - Todas las operaciones retornan Promise
 *    - Preparado para operaciones asíncronas
 * 
 * 4. READONLY ARRAYS
 *    - Garantiza inmutabilidad
 *    - No se pueden modificar los arrays retornados
 */
export interface IProductRepository {
  /**
   * Buscar producto por ID único
   * @returns Product o null si no existe
   */
  findById(id: ProductId): Promise<Product | null>;
  
  /**
   * Buscar producto por slug (URL-friendly)
   * @returns Product o null si no existe
   */
  findBySlug(slug: string): Promise<Product | null>;
  
  /**
   * Buscar productos con filtros, ordenamiento y paginación
   * @returns Resultado paginado con productos
   */
  findAll(query: ProductQuery): Promise<PaginatedProducts>;
  
  /**
   * Buscar productos relacionados a uno dado
   * Útil para "También te puede interesar"
   * @param productId - ID del producto de referencia
   * @param limit - Cantidad máxima de productos relacionados
   */
  findRelated(productId: ProductId, limit: number): Promise<readonly Product[]>;
  
  /**
   * Buscar productos por categoría
   * @param category - Categoría a filtrar
   * @param limit - Cantidad máxima de productos
   */
  findByCategory(
    category: ProductCategory, 
    limit: number
  ): Promise<readonly Product[]>;
  
  /**
   * Buscar productos destacados/populares
   * @param limit - Cantidad de productos a retornar
   */
  findFeatured(limit: number): Promise<readonly Product[]>;
  
  /**
   * Buscar productos en oferta
   * @param limit - Cantidad de productos a retornar
   */
  findOnSale(limit: number): Promise<readonly Product[]>;
}

/**
 * 🎯 CONCEPTO: Interface Segregation Principle (SOLID)
 * 
 * Si en el futuro necesitamos operaciones de escritura (crear, actualizar, eliminar),
 * podríamos crear una interfaz separada:
 * 
 * interface IProductWriteRepository {
 *   create(product: CreateProductDTO): Promise<Product>;
 *   update(id: ProductId, data: Partial<Product>): Promise<Product>;
 *   delete(id: ProductId): Promise<void>;
 * }
 * 
 * Esto separa responsabilidades: lectura vs escritura (CQRS pattern)
 */