
export interface ProductId {
  readonly value: string;
}

export interface Money {
  readonly amount: number;
  readonly currency: 'USD' | 'EUR' | 'MXN';
}

export interface ProductImage {
  readonly url: string;
  readonly alt: string;
  readonly isPrimary: boolean;
}

export type ProductCategory = 
  | 'raw-honey'      // Miel cruda
  | 'flavored-honey' // Miel saborizada
  | 'honeycomb'      // Panal de miel
  | 'bee-products'   // Polen, propóleo, jalea real
  | 'skincare'       // Productos de cuidado de piel
  | 'supplements';   // Suplementos


export type ProductStatus = 'active' | 'draft' | 'archived' | 'out-of-stock';

export interface ProductRating {
  readonly average: number;  // 0-5
  readonly count: number;     // Total de reviews
}

export interface ProductNutrition {
  readonly calories?: number;
  readonly carbohydrates?: string;
  readonly sugars?: string;
  readonly protein?: string;
  readonly minerals?: readonly string[];
}


export interface Product {
  readonly id: ProductId;
  readonly slug: string;
  
  readonly name: string;
  readonly description: string;
  readonly shortDescription: string;
  
  readonly price: Money;
  readonly originalPrice?: Money;
  
  readonly category: ProductCategory;
  readonly status: ProductStatus;
  
  readonly images: readonly ProductImage[];
  
  readonly tags: readonly string[];
  readonly rating: ProductRating;
  readonly soldCount: number;
  
  readonly features: readonly string[];
  readonly origin: string;
  readonly weight: string;
  readonly nutrition?: ProductNutrition;
  
  readonly specifications: Record<string, string>;
  
  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: ProductId;
  createdAt?: Date;
  updatedAt?: Date;
};