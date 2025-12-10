// app/products/page.tsx
'use client';

import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useProducts } from '@/src/presentation/hooks';
import { useDebounce } from '@/src/presentation/hooks/useDebounce';
import { ProductGrid } from '@/src/presentation/components/products/ProductGrid';
import { ProductFilters } from '@/src/presentation/components/products/ProductFilters';
import { ProductCategory } from '@/src/core/domain/entities/Product';
import { SortOption } from '@/src/core/domain/value-objects/ProductFilter';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  margin-bottom: 3rem;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.25rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #ef4444;
  background: #fee2e2;
  border-radius: 1rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

export default function ProductsPage() {
  // 🎯 ESTADO LOCAL: Filtros
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // 🎯 DEBOUNCED SEARCH: Solo busca después de 500ms sin cambios
  const debouncedSearch = useDebounce(searchQuery, 500);

  // 🎯 QUERY: Usar filtros con React Query
  const { products, total, isLoading, error } = useProducts({
    query: {
      page: 1,
      pageSize: 12,
      sortBy,
      filter: {
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        priceRange: priceRange.min > 0 || priceRange.max < 1000 ? priceRange : undefined,
        searchQuery: debouncedSearch || undefined,
        minRating: minRating > 0 ? minRating : undefined,
        inStock: true,
      },
    },
  });

  /**
   * 🎯 HANDLER: Reset todos los filtros
   * 
   * useCallback para evitar recrear la función
   */
  const handleReset = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setSearchQuery('');
    setMinRating(0);
    setSortBy('newest');
  }, []);

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <h3>❌ Error loading products</h3>
          <p>{error.message}</p>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🍯 Royal Honey</Title>
        <Subtitle>
          Premium organic honey and bee products from around the world
        </Subtitle>
      </Header>

      <ProductFilters
        selectedCategories={selectedCategories}
        priceRange={priceRange}
        searchQuery={searchQuery}
        minRating={minRating}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategories}
        onPriceRangeChange={setPriceRange}
        onSearchChange={setSearchQuery}
        onMinRatingChange={setMinRating}
        onSortChange={setSortBy}
        onReset={handleReset}
        totalResults={total}
        isLoading={isLoading}
      />

      {isLoading ? (
        <LoadingContainer>
          🍯 Loading delicious honey products...
        </LoadingContainer>
      ) : (
        <ProductGrid products={products} />
      )}
    </Container>
  );
}