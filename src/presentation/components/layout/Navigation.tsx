'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  position: relative;
  padding: 0.75rem 1.25rem;
  color: ${({ $isActive }) => ($isActive ? '#667eea' : '#6b7280')};
  text-decoration: none;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  font-size: 0.9375rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 3px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  `}
`;

const navItems = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Navigation = memo(function Navigation() {
  const pathname = usePathname();

  return (
    <Nav>
      {navItems.map((item) => (
        <NavLink key={item.href} href={item.href} $isActive={pathname === item.href}>
          {item.label}
        </NavLink>
      ))}
    </Nav>
  );
});