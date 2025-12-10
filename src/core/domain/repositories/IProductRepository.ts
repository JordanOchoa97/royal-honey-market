import { Product, ProductId, ProductCategory } from '../entities/Product';
import { ProductQuery, PaginatedProducts } from '../value-objects/ProductFilter';

export interface IProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findAll(query: ProductQuery): Promise<PaginatedProducts>;
  findRelated(productId: ProductId, limit: number): Promise<readonly Product[]>;
  findByCategory(
    category: ProductCategory, 
    limit: number
  ): Promise<readonly Product[]>;
  findFeatured(limit: number): Promise<readonly Product[]>;
  findOnSale(limit: number): Promise<readonly Product[]>;
}
