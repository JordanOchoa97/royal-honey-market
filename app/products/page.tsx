'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { useProducts } from '@/src/presentation/hooks';
import { useDebounce } from '@/src/presentation/hooks/useDebounce';
import { ProductGrid } from '@/src/presentation/components/products/ProductGrid';
import { ProductFilters } from '@/src/presentation/components/products/ProductFilters';
import { Pagination } from '@/src/presentation/components/products/Pagination';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get('page')) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const { products, total, totalPages, isLoading, error } = useProducts({
    query: {
      page: currentPage,
      pageSize: 9, // 9 productos por página (3x3 grid)
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

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setCurrentPage(page);
  }, [router, searchParams]);


  const handleReset = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setSearchQuery('');
    setMinRating(0);
    setSortBy('newest');
    handlePageChange(1); // Volver a página 1
  }, [handlePageChange]);

  useEffect(() => {
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  }, [selectedCategories, priceRange, debouncedSearch, minRating, sortBy]);

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <h3>Error loading products</h3>
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
        <>
          <ProductGrid products={products} />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </>
      )}
    </Container>
  );
}