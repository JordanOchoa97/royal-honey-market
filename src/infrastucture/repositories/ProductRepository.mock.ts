// src/infrastructure/repositories/ProductRepository.mock.ts

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

/**
 * 🎯 IMPLEMENTACIÓN: MockProductRepository
 * 
 * CONCEPTOS CLAVE:
 * 
 * 1. ADAPTER PATTERN (Arquitectura Hexagonal)
 *    - Esta clase es un ADAPTADOR
 *    - Adapta los datos mock a la interfaz del dominio
 *    - El dominio solo conoce IProductRepository, no esta implementación
 * 
 * 2. DEPENDENCY INVERSION (SOLID)
 *    - La implementación depende de la abstracción
 *    - No al revés
 * 
 * 3. SINGLE RESPONSIBILITY
 *    - Solo se encarga de acceder a datos mock
 *    - Toda la lógica de negocio está en el dominio
 * 
 * 4. SIMULACIÓN DE LATENCIA
 *    - Simulamos delay de red para testing realista
 *    - Útil para probar loading states
 */
export class MockProductRepository implements IProductRepository {
  // 🗄️ Data store privado (en memoria)
  private products: Product[] = [...MOCK_HONEY_PRODUCTS];

  /**
   * 🎯 HELPER PRIVADO: Simular latencia de red
   * 
   * En producción real, esto sería el tiempo de:
   * - HTTP request
   * - Database query
   * - API processing
   * 
   * @param ms - Milisegundos de delay (default: 300-800ms aleatorio)
   */
  private async simulateNetworkDelay(ms?: number): Promise<void> {
    const delay = ms ?? Math.floor(Math.random() * 500) + 300; // 300-800ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * 🔍 Buscar producto por ID
   * 
   * COMPLEJIDAD: O(n) - búsqueda lineal
   * En producción: O(1) con database index
   */
  async findById(id: ProductId): Promise<Product | null> {
    await this.simulateNetworkDelay();
    
    const product = this.products.find(p => p.id.value === id.value);
    return product ?? null;
  }

  /**
   * 🔍 Buscar producto por slug
   * 
   * El slug es la versión URL-friendly del nombre
   * Ejemplo: "Raw Organic Wildflower Honey" -> "raw-organic-wildflower-honey"
   */
  async findBySlug(slug: string): Promise<Product | null> {
    await this.simulateNetworkDelay();
    
    const product = this.products.find(p => p.slug === slug);
    return product ?? null;
  }

  /**
   * 🔍 Buscar productos con filtros, ordenamiento y paginación
   * 
   * CONCEPTOS:
   * 
   * 1. IMMUTABILITY
   *    - Creamos una copia con spread [...this.products]
   *    - No mutamos el array original
   * 
   * 2. FUNCTIONAL PROGRAMMING
   *    - filter(), sort(), slice() son funciones puras
   *    - No efectos secundarios
   * 
   * 3. TYPE NARROWING
   *    - TypeScript entiende los optional chaining y nullish coalescing
   *    - Sabe cuándo las propiedades existen
   */
  async findAll(query: ProductQuery): Promise<PaginatedProducts> {
    await this.simulateNetworkDelay();
    
    // 1️⃣ FILTRADO - Aplicar todos los filtros
    let filtered = this.applyFilters([...this.products], query.filter);
    
    // 2️⃣ ORDENAMIENTO - Aplicar sort
    filtered = this.applySorting(filtered, query.sortBy);
    
    // 3️⃣ PAGINACIÓN - Extraer página específica
    const total = filtered.length;
    const start = (query.page - 1) * query.pageSize;
    const end = start + query.pageSize;
    const items = filtered.slice(start, end);

    // 4️⃣ Retornar resultado paginado con metadata
    return createPaginatedResult(items, total, query.page, query.pageSize);
  }

  /**
   * 🎯 MÉTODO PRIVADO: Aplicar filtros
   * 
   * PATTERN: Chain of Responsibility
   * - Cada filtro se aplica secuencialmente
   * - Cada uno reduce el conjunto de resultados
   */
  private applyFilters(
    products: Product[], 
    filter?: ProductQuery['filter']
  ): Product[] {
    if (!filter) return products;

    let result = products;

    // 🏷️ Filtro por categorías
    if (filter.categories && filter.categories.length > 0) {
      result = result.filter(p => 
        filter.categories!.includes(p.category)
      );
    }

    // 💰 Filtro por rango de precio
    if (filter.priceRange) {
      const { min, max } = filter.priceRange;
      result = result.filter(p => 
        p.price.amount >= min && p.price.amount <= max
      );
    }

    // 🏷️ Filtro por tags
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(p =>
        filter.tags!.some(tag => 
          p.tags.includes(tag)
        )
      );
    }

    // 🔍 Búsqueda de texto (case-insensitive)
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

    // ⭐ Filtro por rating mínimo
    if (filter.minRating !== undefined) {
      result = result.filter(p => 
        p.rating.average >= filter.minRating!
      );
    }

    // 📦 Filtro por status
    if (filter.status) {
      result = result.filter(p => 
        p.status === filter.status
      );
    }

    // 🌍 Filtro por origen
    if (filter.origin) {
      result = result.filter(p => 
        p.origin.toLowerCase().includes(filter.origin!.toLowerCase())
      );
    }

    // 📦 Filtro por stock (solo productos activos)
    if (filter.inStock) {
      result = result.filter(p => 
        p.status === 'active'
      );
    }

    return result;
  }

  /**
   * 🎯 MÉTODO PRIVADO: Aplicar ordenamiento
   * 
   * PATTERN: Strategy Pattern
   * - Cada opción de sort es una estrategia diferente
   * 
   * NOTA: Array.sort() muta el array, pero ya trabajamos con una copia
   */
  private applySorting(
    products: Product[], 
    sortBy?: ProductQuery['sortBy']
  ): Product[] {
    if (!sortBy) return products;

    const sorted = [...products]; // Extra safety: otra copia

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

  /**
   * 🔗 Buscar productos relacionados
   * 
   * ALGORITMO:
   * 1. Encontrar el producto de referencia
   * 2. Buscar productos con misma categoría o tags compartidos
   * 3. Ordenar por "relevancia" (cantidad de tags en común)
   * 4. Limitar resultados
   */
  async findRelated(
    productId: ProductId, 
    limit: number
  ): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200); // Más rápido que búsqueda normal
    
    const product = await this.findById(productId);
    if (!product) return [];

    // Calcular score de relevancia para cada producto
    const scored = this.products
      .filter(p => p.id.value !== productId.value) // Excluir el mismo producto
      .map(p => ({
        product: p,
        score: this.calculateRelevanceScore(product, p)
      }))
      .filter(item => item.score > 0) // Solo productos con alguna relación
      .sort((a, b) => b.score - a.score) // Mayor score primero
      .slice(0, limit)
      .map(item => item.product);

    return scored;
  }

  /**
   * 🎯 HELPER PRIVADO: Calcular relevancia entre productos
   * 
   * SCORING ALGORITHM:
   * - Misma categoría: +10 puntos
   * - Cada tag compartido: +2 puntos
   * - Mismo origen: +5 puntos
   * - Rango de precio similar (±20%): +3 puntos
   */
  private calculateRelevanceScore(
    reference: Product, 
    candidate: Product
  ): number {
    let score = 0;

    // Misma categoría
    if (candidate.category === reference.category) {
      score += 10;
    }

    // Tags compartidos
    const sharedTags = candidate.tags.filter(tag => 
      reference.tags.includes(tag)
    );
    score += sharedTags.length * 2;

    // Mismo origen
    if (candidate.origin === reference.origin) {
      score += 5;
    }

    // Precio similar (±20%)
    const priceRatio = candidate.price.amount / reference.price.amount;
    if (priceRatio >= 0.8 && priceRatio <= 1.2) {
      score += 3;
    }

    return score;
  }

  /**
   * 🏷️ Buscar productos por categoría
   */
  async findByCategory(
    category: ProductCategory, 
    limit: number
  ): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200);
    
    return this.products
      .filter(p => p.category === category && p.status === 'active')
      .slice(0, limit);
  }

  /**
   * ⭐ Buscar productos destacados
   * 
   * CRITERIO: Productos con mejor rating y más ventas
   */
  async findFeatured(limit: number): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200);
    
    return [...this.products]
      .filter(p => p.status === 'active')
      .sort((a, b) => {
        // Score combinado: rating * 10 + log(soldCount)
        const scoreA = a.rating.average * 10 + Math.log(a.soldCount + 1);
        const scoreB = b.rating.average * 10 + Math.log(b.soldCount + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * 💸 Buscar productos en oferta
   * 
   * CRITERIO: Productos con originalPrice (tienen descuento)
   */
  async findOnSale(limit: number): Promise<readonly Product[]> {
    await this.simulateNetworkDelay(200);
    
    return this.products
      .filter(p => p.status === 'active' && p.originalPrice !== undefined)
      .sort((a, b) => {
        // Ordenar por % de descuento (mayor descuento primero)
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

/**
 * 🎯 FACTORY FUNCTION: Crear instancia del repositorio
 * 
 * VENTAJAS:
 * - Encapsula la creación
 * - Fácil de mockear en tests
 * - Podríamos agregar configuración aquí
 */
export function createMockProductRepository(): IProductRepository {
  return new MockProductRepository();
}