'use client';

import styled from 'styled-components';
import { memo } from 'react';

const CartButtonWrapper = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    color: #667eea;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    padding: 0.75rem;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    justify-content: center;
  }
`;

const CartIcon = styled.span`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartText = styled.span`
  @media (max-width: 640px) {
    display: none;
  }
`;

const CartBadge = styled.span<{ $count: number }>`
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  animation: ${({ $count }) => ($count > 0 ? 'pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none')};

  @keyframes pop {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

export const CartButton = memo(function CartButton({ itemCount, onClick }: CartButtonProps) {
  return (
    <CartButtonWrapper onClick={onClick} aria-label={`Cart with ${itemCount} items`}>
      <CartIcon>🛒</CartIcon>
      <CartText>Cart</CartText>
      {itemCount > 0 && <CartBadge $count={itemCount}>{itemCount > 99 ? '99+' : itemCount}</CartBadge>}
    </CartButtonWrapper>
  );
});