// src/core/application/use-cases/index.ts

/**
 * 🎯 BARREL EXPORT
 * 
 * Permite importar múltiples use cases en una sola línea:
 * 
 * import { 
 *   GetProductsUseCase, 
 *   GetProductByIdUseCase 
 * } from '@/src/core/application/use-cases';
 */

export { GetProductsUseCase } from './GetProducts';
export { GetProductByIdUseCase } from './GetProductById';
export { GetProductBySlugUseCase } from './GetProductBySlug';
export { GetRelatedProductsUseCase } from './GetRelatedProducts';