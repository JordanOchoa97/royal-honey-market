// src/presentation/components/ui/Skeleton.tsx
'use client';

import styled, { keyframes } from 'styled-components';
import { memo } from 'react';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div<{ $width?: string; $height?: string; $radius?: string }>`
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${({ $radius = '8px' }) => $radius};
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '20px' }) => $height};
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  className?: string;
}

export const Skeleton = memo(function Skeleton({ 
  width, 
  height, 
  radius, 
  className 
}: SkeletonProps) {
  return (
    <SkeletonBase 
      $width={width} 
      $height={height} 
      $radius={radius}
      className={className}
    />
  );
});

// Skeleton presets
export const SkeletonText = styled(Skeleton)`
  height: 16px;
  margin-bottom: 8px;
`;

export const SkeletonTitle = styled(Skeleton)`
  height: 28px;
  width: 70%;
  margin-bottom: 12px;
`;

export const SkeletonImage = styled(Skeleton)`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
`;

export const SkeletonButton = styled(Skeleton)`
  height: 44px;
  width: 100%;
  border-radius: 12px;
`;

// Product Card Skeleton
const ProductSkeletonCard = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProductSkeletonContent = styled.div`
  padding: 1.5rem;
`;

const ProductSkeletonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <ProductSkeletonCard>
      <SkeletonImage />
      <ProductSkeletonContent>
        <Skeleton width="40%" height="14px" radius="6px" />
        <SkeletonTitle />
        <SkeletonText />
        <SkeletonText width="80%" />
        <ProductSkeletonFooter>
          <Skeleton width="80px" height="32px" radius="8px" />
          <Skeleton width="60px" height="24px" radius="6px" />
        </ProductSkeletonFooter>
      </ProductSkeletonContent>
    </ProductSkeletonCard>
  );
});

// Grid of skeletons
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = memo(function ProductGridSkeleton({ 
  count = 6 
}: ProductGridSkeletonProps) {
  return (
    <SkeletonGrid>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </SkeletonGrid>
  );
});