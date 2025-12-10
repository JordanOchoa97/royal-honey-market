// app/not-found.tsx
'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { Button } from '@/src/presentation/components/ui/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 4rem 2rem;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 800;
  color: #f59e0b;
  margin-bottom: 1rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 3rem;
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const Icon = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PopularLinks = styled.div`
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid #e5e7eb;
`;

const PopularTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 800px;
`;

const QuickLink = styled(Link)`
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: #1f2937;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
    transform: translateY(-2px);
  }

  span:first-child {
    font-size: 1.5rem;
  }
`;

export default function NotFound() {
  return (
    <Container>
      <Icon>🍯</Icon>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        Oops! The page you&apos;re looking for seems to have wandered off like a busy bee. 
        Let&apos;s help you find your way back to the honey.
      </Description>

      <ButtonGroup>
        <Link href="/">
          <Button size="lg" variant="primary">
            🏠 Go Home
          </Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline">
            🍯 Browse Products
          </Button>
        </Link>
      </ButtonGroup>

      <PopularLinks>
        <PopularTitle>Popular Pages</PopularTitle>
        <LinkGrid>
          <QuickLink href="/products">
            <span>🛍️</span>
            <span>All Products</span>
          </QuickLink>
          <QuickLink href="/categories">
            <span>📂</span>
            <span>Categories</span>
          </QuickLink>
          <QuickLink href="/about">
            <span>ℹ️</span>
            <span>About Us</span>
          </QuickLink>
          <QuickLink href="/contact">
            <span>📧</span>
            <span>Contact</span>
          </QuickLink>
        </LinkGrid>
      </PopularLinks>
    </Container>
  );
}