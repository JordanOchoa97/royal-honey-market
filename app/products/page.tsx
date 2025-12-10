import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const ProductsPageContent = dynamic(() => import('./ProductsPageContent'), {
  ssr: false,
});
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