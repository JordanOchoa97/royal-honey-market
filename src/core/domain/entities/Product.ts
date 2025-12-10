// src/core/domain/entities/Product.ts

/**
 * 🎯 VALUE OBJECT: ProductId
 * 
 * En DDD, los Value Objects son objetos inmutables que se identifican 
 * por su valor, no por una identidad.
 * 
 * VENTAJAS:
 * - Type safety: No podemos pasar un string cualquiera como ID
 * - Validación centralizada
 * - Inmutabilidad (readonly)
 */
export interface ProductId {
  readonly value: string;
}

/**
 * 🎯 VALUE OBJECT: Money
 * 
 * Representa dinero con cantidad y moneda.
 * Evita bugs comunes como sumar precios en diferentes monedas.
 */
export interface Money {
  readonly amount: number;
  readonly currency: 'USD' | 'EUR' | 'MXN';
}

/**
 * 🎯 VALUE OBJECT: ProductImage
 */
export interface ProductImage {
  readonly url: string;
  readonly alt: string;
  readonly isPrimary: boolean;
}

/**
 * 🎯 TYPE UNION: ProductCategory
 * 
 * Usamos union types en lugar de enum para mejor DX
 * TypeScript puede inferir y autocompletar estos valores
 */
export type ProductCategory = 
  | 'raw-honey'      // Miel cruda
  | 'flavored-honey' // Miel saborizada
  | 'honeycomb'      // Panal de miel
  | 'bee-products'   // Polen, propóleo, jalea real
  | 'skincare'       // Productos de cuidado de piel
  | 'supplements';   // Suplementos

/**
 * 🎯 TYPE UNION: ProductStatus
 */
export type ProductStatus = 'active' | 'draft' | 'archived' | 'out-of-stock';

/**
 * 🎯 VALUE OBJECT: ProductRating
 */
export interface ProductRating {
  readonly average: number;  // 0-5
  readonly count: number;     // Total de reviews
}

/**
 * 🎯 VALUE OBJECT: ProductNutrition
 * Información nutricional específica para productos de miel
 */
export interface ProductNutrition {
  readonly calories?: number;
  readonly carbohydrates?: string;
  readonly sugars?: string;
  readonly protein?: string;
  readonly minerals?: readonly string[];
}

/**
 * 🎯 ENTITY: Product
 * 
 * En DDD, las Entities tienen identidad única (id) y pueden cambiar
 * a lo largo del tiempo (aunque aquí usamos readonly por inmutabilidad)
 * 
 * PRINCIPIO: Rich Domain Model
 * - La entidad contiene toda la información del producto
 * - No solo un "data bag", sino que representa el concepto de negocio
 */
export interface Product {
  // Identificación
  readonly id: ProductId;
  readonly slug: string;
  
  // Información básica
  readonly name: string;
  readonly description: string;
  readonly shortDescription: string;
  
  // Pricing
  readonly price: Money;
  readonly originalPrice?: Money;  // Optional: para descuentos
  
  // Clasificación
  readonly category: ProductCategory;
  readonly status: ProductStatus;
  
  // Media
  readonly images: readonly ProductImage[];
  
  // Metadata
  readonly tags: readonly string[];
  readonly rating: ProductRating;
  readonly soldCount: number;
  
  // Detalles del producto
  readonly features: readonly string[];
  readonly origin: string;  // De dónde proviene la miel
  readonly weight: string;   // "250g", "500g", "1kg"
  readonly nutrition?: ProductNutrition;
  
  // Especificaciones técnicas (key-value flexible)
  readonly specifications: Record<string, string>;
  
  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * 🎯 HELPER TYPE: Crear un nuevo producto (sin readonly)
 * 
 * Útil cuando queremos crear productos pero no queremos
 * especificar todos los campos readonly manualmente
 */
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: ProductId;
  createdAt?: Date;
  updatedAt?: Date;
};