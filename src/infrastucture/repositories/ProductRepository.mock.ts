import { 
  IProductRepository 
} from '@/src/core/domain/repositories/IProductRepository';
import { 
  Product, 
  ProductId, 
  ProductCategory 
} from '@/src/core/domain/entities/Product';
import { 
  ProductQuery, 
  PaginatedProducts,
  createPaginatedResult 
} from '@/src/core/domain/value-objects/ProductFilter';
import { MOCK_HONEY_PRODUCTS } from '../mock-data/products.mock';

export class MockProductRepository implements IProductRepository {
  private products: Product[] = [...MOCK_HONEY_PRODUCTS];

  private async simulateNetworkDelay(ms?: number): Promise<void> {
    const delay = ms ?? Math.floor(Math.random() * 500) + 300; // 300-800ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async findById(id: ProductId): Promise<Product | null> {
    await this.simulateNetworkDelay();
    
    const product = this.products.find(p => p.id.value === id.value);
    return product ?? null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    await this.simulateNetworkDelay();
    
    const product = this.products.find(p => p.slug === slug);
    return product ?? null;
  }

  async findAll(query: ProductQuery): Promise<PaginatedProducts> {
    await this.simulateNetworkDelay();
    
    let filtered = this.applyFilters([...this.products], query.filter);
    
    filtered = this.applySorting(filtered, query.sortBy);
    
    const total = filtered.length;
    const start = (query.page - 1) * query.pageSize;
    const end = start + query.pageSize;
    const items = filtered.slice(start, end);

    return createPaginatedResult(items, total, query.page, query.pageSize);
  }

  private applyFilters(
    products: Product[], 
    filter?: ProductQuery['filter']
  ): Product[] {
    if (!filter) return products;

    let result = products;

    if (filter.categories && filter.categories.length > 0) {
      result = result.filter(p => 
        filter.categories!.includes(p.category)
      );
    }

    if (filter.priceRange) {
      const { min, max } = filter.priceRange;
      result = result.filter(p => 
        p.price.amount >= min && p.price.amount <= max
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(p =>
        filter.tags!.some(tag => 
          p.tags.includes(tag)
        )
      );
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query)) ||
        p.origin.toLowerCase().includes(query)
      );
    }

    if (filter.minRating !== undefined) {
      result = result.filter(p => 
        p.rating.average >= filter.minRating!
      );
    }

    if (filter.status) {
      result = result.filter(p => 
        p.status === filter.status
      );
    }

    if (filter.origin) {
      result = result.filter(p => 
        p.origin.toLowerCase().includes(filter.origin!.toLowerCase())
      );
    }

    if (filter.inStock) {
      result = result.filter(p => 
        p.status === 'active'
      );
    }

    return result;
  }

  private applySorting(
    products: Product[], 
    sortBy?: ProductQuery['sortBy']
  ): Product[] {
    if (!sortBy) return products;

    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price.amount - b.price.amount);
      
      case 'price-desc':
        return sorted.sort((a, b) => b.price.amount - a.price.amount);
      
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating.average - a.rating.average);
      
      case 'popularity-desc':
        return sorted.sort((a, b) => b.soldCount - a.soldCount);
      
      case 'newest':
        return sorted.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
      
      case 'name-asc':
        return sorted.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      
      case 'name-desc':
        return sorted.sort((a, b) => 
          b.name.localeCompare(a.name)
        );
      
      default:
        return sorted;
    }
  }

  async findRelated(
    productId: ProductId, 
    limit: number
  ): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200);
    
    const product = await this.findById(productId);
    if (!product) return [];

    const scored = this.products
      .filter(p => p.id.value !== productId.value)
      .map(p => ({
        product: p,
        score: this.calculateRelevanceScore(product, p)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);

    return scored;
  }

  private calculateRelevanceScore(
    reference: Product, 
    candidate: Product
  ): number {
    let score = 0;

    if (candidate.category === reference.category) {
      score += 10;
    }

    const sharedTags = candidate.tags.filter(tag => 
      reference.tags.includes(tag)
    );
    score += sharedTags.length * 2;

    if (candidate.origin === reference.origin) {
      score += 5;
    }

    const priceRatio = candidate.price.amount / reference.price.amount;
    if (priceRatio >= 0.8 && priceRatio <= 1.2) {
      score += 3;
    }

    return score;
  }

  async findByCategory(
    category: ProductCategory, 
    limit: number
  ): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200);
    
    return this.products
      .filter(p => p.category === category && p.status === 'active')
      .slice(0, limit);
  }

  async findFeatured(limit: number): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200);
    
    return [...this.products]
      .filter(p => p.status === 'active')
      .sort((a, b) => {
        const scoreA = a.rating.average * 10 + Math.log(a.soldCount + 1);
        const scoreB = b.rating.average * 10 + Math.log(b.soldCount + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  async findOnSale(limit: number): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200);
    
    return this.products
      .filter(p => p.status === 'active' && p.originalPrice !== undefined)
      .sort((a, b) => {
        const discountA = a.originalPrice 
          ? ((a.originalPrice.amount - a.price.amount) / a.originalPrice.amount) * 100
          : 0;
        const discountB = b.originalPrice 
          ? ((b.originalPrice.amount - b.price.amount) / b.originalPrice.amount) * 100
          : 0;
        return discountB - discountA;
      })
      .slice(0, limit);
  }
}

export function createMockProductRepository(): IProductRepository {
  return new MockProductRepository();
}