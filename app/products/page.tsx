'use client';
import { Suspense } from 'react';
import styled from 'styled-components';
import ProductsPageContent from './ProductsPageContent';

const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #6b7280;
`;

export default function ProductsPage() {
  return (
    <Suspense 
      fallback={
        <LoadingFallback>
          🍯 Loading products...
        </LoadingFallback>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}