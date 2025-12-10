// src/presentation/components/layout/Header.tsx
'use client';

import styled from 'styled-components';
import { memo, useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { SearchBar } from './SearchBar';
import { CartButton } from './CartButton';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '@/src/presentation/store/cartStore';

const HeaderWrapper = styled.header<{ $isScrolled: boolean }>`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${({ $isScrolled }) => ($isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white')};
  backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? 'blur(12px)' : 'none')};
  border-bottom: 1px solid ${({ $isScrolled }) => ($isScrolled ? '#e5e7eb' : 'transparent')};
  transition: all 0.3s ease;
  box-shadow: ${({ $isScrolled }) => ($isScrolled ? '0 4px 16px rgba(0, 0, 0, 0.04)' : 'none')};
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;

  @media (max-width: 968px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const HeaderCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
  margin: 0 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

// Custom hooks for cart selectors
const useCartCount = () => useCartStore((state) => state.getItemCount());
const useToggleCart = () => useCartStore((state) => state.toggleCart);

export const Header = memo(function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartItemCount = useCartCount();
  const toggleCart = useToggleCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <HeaderWrapper $isScrolled={isScrolled}>
        <HeaderContainer>
          <HeaderLeft>
            <Logo />
            <Navigation />
          </HeaderLeft>

          <HeaderCenter>
            <SearchBar />
          </HeaderCenter>

          <HeaderRight>
            <CartButton itemCount={cartItemCount} onClick={toggleCart} />
            <MenuButton
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              ☰
            </MenuButton>
          </HeaderRight>
        </HeaderContainer>
      </HeaderWrapper>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
});