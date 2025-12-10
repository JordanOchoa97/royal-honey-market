'use client';

import { use, Suspense } from 'react';
import styled from 'styled-components';
import ProductDetailContent from './ProductDetailContent';

const LoadingFallback = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #6b7280;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = use(params);
  
  return (
    <Suspense 
      fallback={
        <LoadingFallback>
          <Spinner />
          <span>🍯 Loading product details...</span>
        </LoadingFallback>
      }
    >
      <ProductDetailContent slug={slug} />
    </Suspense>
  );
}