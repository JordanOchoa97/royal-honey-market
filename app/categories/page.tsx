// app/categories/page.tsx
'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { Button } from '@/src/presentation/components/ui/Button';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #f59e0b;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #6b7280;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--gradient);
    transition: height 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);

    &::before {
      height: 100%;
      opacity: 0.05;
    }
  }
`;

const CategoryIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const CategoryName = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const CategoryDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const CategoryCount = styled.div`
  text-align: center;
  font-weight: 600;
  color: var(--color);
  font-size: 0.9375rem;
`;

const categories = [
  {
    id: 'raw-honey',
    name: 'Raw Honey',
    icon: '🍯',
    description: 'Pure, unfiltered honey straight from the hive. Rich in natural enzymes and nutrients.',
    count: '12 Products',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#f59e0b',
  },
  {
    id: 'flavored-honey',
    name: 'Flavored Honey',
    icon: '🌸',
    description: 'Artisanal honey infused with natural flavors like lavender, cinnamon, and vanilla.',
    count: '8 Products',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    color: '#a855f7',
  },
  {
    id: 'honeycomb',
    name: 'Honeycomb',
    icon: '⬡',
    description: 'Fresh honeycomb packed with pure honey. A unique and natural treat.',
    count: '5 Products',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    color: '#f97316',
  },
  {
    id: 'bee-products',
    name: 'Bee Products',
    icon: '🐝',
    description: 'Propolis, bee pollen, and royal jelly. Packed with health benefits.',
    count: '15 Products',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#10b981',
  },
  {
    id: 'skincare',
    name: 'Honey Skincare',
    icon: '✨',
    description: 'Natural skincare products infused with honey and beeswax for glowing skin.',
    count: '10 Products',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    color: '#ec4899',
  },
  {
    id: 'supplements',
    name: 'Supplements',
    icon: '💊',
    description: 'Honey-based supplements and vitamins for optimal health and wellness.',
    count: '7 Products',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#3b82f6',
  },
];

export default function CategoriesPage() {
  return (
    <Container>
      <Hero>
        <Title>Explore Our Categories</Title>
        <Subtitle>
          Discover our wide range of premium honey products, carefully curated for quality and taste
        </Subtitle>
      </Hero>

      <CategoriesGrid>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            href={`/products?category=${category.id}`}
            style={
              {
                '--gradient': category.gradient,
                '--color': category.color,
              } as React.CSSProperties
            }
          >
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
            <CategoryDescription>{category.description}</CategoryDescription>
            <CategoryCount>{category.count}</CategoryCount>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </Container>
  );
}