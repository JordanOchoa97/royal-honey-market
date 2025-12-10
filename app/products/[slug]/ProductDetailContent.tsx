'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useProductBySlug, useRelatedProducts } from '@/src/presentation/hooks';
import { Button } from '@/src/presentation/components/ui/Button';
import { ProductCard } from '@/src/presentation/components/products/ProductCard';
import { useCartStore } from '@/src/presentation/store/cartStore';

interface ProductDetailContentProps {
  slug: string;
}

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: #6b7280;
  flex-wrap: wrap;

  a {
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #f59e0b;
    }
  }

  span {
    color: #d1d5db;
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    gap: 3rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 2rem;
  height: fit-content;

  @media (max-width: 768px) {
    position: static;
  }
`;

const MainImage = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImagePlaceholder = styled.div<{ $category: string }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  padding: 2rem;

  ${({ $category }) => {
    const gradients: Record<string, string> = {
      'raw-honey': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'flavored-honey': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      'honeycomb': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      'bee-products': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'skincare': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      'supplements': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    };
    return `background: ${gradients[$category] || gradients['raw-honey']};`;
  }}
`;

const Thumbnails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
`;

const Thumbnail = styled.button<{ $isActive: boolean }>`
  position: relative;
  padding-top: 100%;
  border: 3px solid ${props => (props.$isActive ? '#f59e0b' : '#e5e7eb')};
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: #f3f4f6;

  &:hover {
    border-color: #f59e0b;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoSection = styled.div``;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.125rem;
  color: #fbbf24;
  font-size: 1.25rem;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CurrentPrice = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #f59e0b;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 1.5rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background: #ef4444;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Features = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 1rem;
  color: #4b5563;

  &::before {
    content: '✓';
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border-radius: 50%;
    font-weight: 700;
  }
`;

const Specifications = styled.div`
  background: #f9fafb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const SpecLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
`;

const SpecValue = styled.span`
  color: #1f2937;
`;

const RelatedSection = styled.section`
  margin-top: 4rem;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem 2rem;

  h2 {
    font-size: 2rem;
    color: #1f2937;
  }

  p {
    font-size: 1.125rem;
    color: #6b7280;
  }
`;

export default function ProductDetailContent({ slug }: ProductDetailContentProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useProductBySlug({ slug });

  const { data: relatedProducts } = useRelatedProducts({
    productId: product?.id || null,
    limit: 4,
    enabled: !!product,
  });

  const { addItem, openCart, hasItem } = useCartStore();
  const isInCart = hasItem(product?.id.value || '');

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
      openCart();
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Loading product...
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <NotFound>
          <h2>🍯 Product Not Found</h2>
          <p>Sorry, we couldn&apos;t find the honey product you&apos;re looking for.</p>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </NotFound>
      </Container>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice.amount - product.price.amount) / product.originalPrice.amount) * 100)
    : 0;

  const selectedImage = product.images[selectedImageIndex];

  return (
    <Container>
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </Breadcrumbs>

      <ProductLayout>
        {/* Image Section */}
        <ImageSection>
          <MainImage>
            <ImagePlaceholder $category={product.category}>
              {product.name.split(' ').slice(0, 3).join(' ')}
            </ImagePlaceholder>
          </MainImage>

          {product.images.length > 1 && (
            <Thumbnails>
              {product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  $isActive={selectedImageIndex === index}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <ImagePlaceholder $category={product.category}>
                    {index + 1}
                  </ImagePlaceholder>
                </Thumbnail>
              ))}
            </Thumbnails>
          )}
        </ImageSection>

        {/* Info Section */}
        <InfoSection>
          <CategoryBadge>
            {product.category.replace('-', ' ')}
          </CategoryBadge>

          <ProductTitle>{product.name}</ProductTitle>

          <Rating>
            <Stars>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < Math.floor(product.rating.average) ? '★' : '☆'}</span>
              ))}
            </Stars>
            <span>{product.rating.average.toFixed(1)}</span>
            <span>•</span>
            <span>{product.rating.count.toLocaleString()} reviews</span>
            <span>•</span>
            <span>📦 {product.soldCount.toLocaleString()} sold</span>
          </Rating>

          <PriceSection>
            <CurrentPrice>
              ${product.price.amount.toFixed(2)}
            </CurrentPrice>
            {product.originalPrice && (
              <>
                <OriginalPrice>
                  ${product.originalPrice.amount.toFixed(2)}
                </OriginalPrice>
                <DiscountBadge>Save {discount}%</DiscountBadge>
              </>
            )}
          </PriceSection>

          <Description>{product.description}</Description>

          <ActionButtons>
            <Button 
                size="lg" 
                fullWidth 
                onClick={handleAddToCart}
                disabled={!product}
            >
                {isInCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
            </Button>
            <Button size="lg" variant="outline">
                ❤️ Wishlist
            </Button>
        </ActionButtons>

          <Features>
            <SectionTitle>Key Features</SectionTitle>
            <FeatureList>
              {product.features.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </FeatureList>
          </Features>

          <Specifications>
            <SectionTitle>Specifications</SectionTitle>
            <SpecRow>
              <SpecLabel>Origin</SpecLabel>
              <SpecValue>{product.origin}</SpecValue>
            </SpecRow>
            <SpecRow>
              <SpecLabel>Weight</SpecLabel>
              <SpecValue>{product.weight}</SpecValue>
            </SpecRow>
            {Object.entries(product.specifications).map(([key, value]) => (
              <SpecRow key={key}>
                <SpecLabel>{key}</SpecLabel>
                <SpecValue>{value}</SpecValue>
              </SpecRow>
            ))}
          </Specifications>
        </InfoSection>
      </ProductLayout>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedSection>
          <SectionTitle>You May Also Like</SectionTitle>
          <RelatedGrid>
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id.value} product={relatedProduct} />
            ))}
          </RelatedGrid>
        </RelatedSection>
      )}
    </Container>
  );
}