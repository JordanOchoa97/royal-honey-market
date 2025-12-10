'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect } from 'react';

const MenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
`;

const MenuPanel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: white;
  z-index: 999;
  padding: 2rem 1.5rem;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  overflow-y: auto;

  @media (min-width: 769px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    transform: rotate(90deg);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MenuTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1f2937;
`;

const MenuNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuLink = styled(Link)<{ $isActive: boolean }>`
  padding: 1rem;
  color: ${({ $isActive }) => ($isActive ? '#667eea' : '#1f2937')};
  text-decoration: none;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  font-size: 1rem;
  border-radius: 8px;
  background: ${({ $isActive }) => ($isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    transform: translateX(4px);
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
`;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/products', label: 'Products', icon: '🍯' },
  { href: '/categories', label: 'Categories', icon: '📂' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
  { href: '/contact', label: 'Contact', icon: '📧' },
];

export const MobileMenu = memo(function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <MenuOverlay $isOpen={isOpen} onClick={onClose} />
      <MenuPanel $isOpen={isOpen}>
        <CloseButton onClick={onClose} aria-label="Close menu">
          ✕
        </CloseButton>
        <MenuTitle>Menu</MenuTitle>
        <MenuNav>
          {navItems.map((item) => (
            <MenuLink key={item.href} href={item.href} $isActive={pathname === item.href} onClick={onClose}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </MenuLink>
          ))}
        </MenuNav>
        <MenuDivider />
      </MenuPanel>
    </>
  );
});