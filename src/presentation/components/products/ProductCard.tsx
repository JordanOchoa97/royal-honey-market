// src/presentation/components/products/ProductCard.tsx

'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Product } from '@/src/core/domain/entities/Product';
import { 
  Card, 
  CardImage, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter,
  CardBadgeContainer 
} from '../ui/Card';
import { Button } from '../ui/Button';
import { memo } from 'react';

/**
 * 🎯 COMPONENT: ProductCard
 * 
 * CONCEPTOS:
 * 
 * 1. PRESENTATIONAL COMPONENT
 *    - Solo se encarga de mostrar datos
 *    - No tiene lógica de negocio
 *    - Recibe todo por props
 * 
 * 2. MEMO OPTIMIZATION
 *    - React.memo previene re-renders innecesarios
 *    - Solo re-renderiza si product cambia
 * 
 * 3. STYLED COMPONENTS
 *    - CSS-in-JS con scoping automático
 */

interface ProductCardProps {
  product: Product;
}

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Badge = styled.span<{ $variant?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  backdrop-filter: blur(8px);
  
  ${({ $variant = 'primary' }) => {
    const colors = {
      'raw-honey': 'rgba(251, 191, 36, 0.9)',
      'flavored-honey': 'rgba(168, 85, 247, 0.9)',
      'honeycomb': 'rgba(245, 158, 11, 0.9)',
      'bee-products': 'rgba(16, 185, 129, 0.9)',
      'skincare': 'rgba(236, 72, 153, 0.9)',
      'supplements': 'rgba(59, 130, 246, 0.9)',
      'discount': 'rgba(239, 68, 68, 0.9)',
    };
    return `background: ${colors[$variant as keyof typeof colors] || colors['raw-honey']}; color: white;`;
  }}
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
`;

const Star = styled.span`
  color: #fbbf24;
  font-size: 1rem;
`;

const Separator = styled.span`
  color: #d1d5db;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const ImagePlaceholder = styled.div<{ $category: string }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
  
  ${({ $category }) => {
    const gradients = {
      'raw-honey': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'flavored-honey': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      'honeycomb': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      'bee-products': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'skincare': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      'supplements': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    };
    return `background: ${gradients[$category as keyof typeof gradients] || gradients['raw-honey']};`;
  }}
`;

export const ProductCard = memo(({ product }: ProductCardProps) => {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  
  // Calcular descuento
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice.amount - product.price.amount) / product.originalPrice.amount) * 100)
    : 0;

  // Formatear precio
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <Card clickable>
      <ProductLink href={`/products/${product.slug}`}>
        <CardImage aspectRatio="16/9">
          <ImagePlaceholder $category={product.category}>
            {product.name.split(' ').slice(0, 2).join(' ')}
          </ImagePlaceholder>
          
          <CardBadgeContainer>
            <Badge $variant={product.category}>
              {product.category.replace('-', ' ')}
            </Badge>
            {discount > 0 && (
              <Badge $variant="discount">-{discount}%</Badge>
            )}
          </CardBadgeContainer>
        </CardImage>
        
        <CardContent>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.shortDescription}</CardDescription>
          </CardHeader>

          <MetaInfo>
            <Rating>
              <Star>★</Star>
              <span>{product.rating.average.toFixed(1)}</span>
            </Rating>
            <Separator>•</Separator>
            <span>{product.rating.count.toLocaleString()} reviews</span>
            <Separator>•</Separator>
            <span>📦 {product.soldCount.toLocaleString()} sold</span>
          </MetaInfo>

          <CardFooter>
            <PriceContainer>
              <CurrentPrice>
                {formatPrice(product.price.amount, product.price.currency)}
              </CurrentPrice>
              {product.originalPrice && (
                <OriginalPrice>
                  {formatPrice(product.originalPrice.amount, product.originalPrice.currency)}
                </OriginalPrice>
              )}
            </PriceContainer>
            <Button size="sm" variant="primary">
              View Details
            </Button>
          </CardFooter>
        </CardContent>
      </ProductLink>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';