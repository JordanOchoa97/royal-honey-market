'use client';

import styled from 'styled-components';
import { Product } from '@/src/core/domain/entities/Product';
import { ProductCard } from './ProductCard';
import { memo } from 'react';

interface ProductGridProps {
  products: readonly Product[];
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }

  p {
    font-size: 1rem;
  }
`;

export const ProductGrid = memo(({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <EmptyState>
        <h3>🍯 No honey products found</h3>
        <p>Try adjusting your filters or search query</p>
      </EmptyState>
    );
  }

  return (
    <Grid>
      {products.map(product => (
        <ProductCard key={product.id.value} product={product} />
      ))}
    </Grid>
  );
});

ProductGrid.displayName = 'ProductGrid';