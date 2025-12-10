'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { memo } from 'react';

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const LogoBrand = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoTagline = styled.span`
  font-size: 0.625rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const Logo = memo(function Logo() {
  return (
    <LogoLink href="/">
      <LogoIcon>🍯</LogoIcon>
      <LogoText>
        <LogoBrand>Royal Honey</LogoBrand>
        <LogoTagline>Premium Quality</LogoTagline>
      </LogoText>
    </LogoLink>
  );
});