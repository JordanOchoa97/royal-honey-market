// src/presentation/components/ui/Button.tsx
'use client';

import styled, { css } from 'styled-components';
import { ButtonHTMLAttributes, forwardRef, memo } from 'react';

// 📝 TIPOS: Definimos las variantes que nuestro botón puede tener
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// 📝 INTERFACE: Extendemos los atributos nativos de HTML button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

// 🎨 STYLED COMPONENT: Botón con todas las variantes
const StyledButton = styled.button<ButtonProps>`
  /* Base styles - aplicados a todos los botones */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  /* Estado disabled */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 📏 TAMAÑOS - Usando function para diferentes sizes */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          min-height: 36px;
        `;
      case 'lg':
        return css`
          padding: 1rem 2rem;
          font-size: 1.125rem;
          min-height: 52px;
        `;
      default: // 'md'
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          min-height: 44px;
        `;
    }
  }}

  /* 🎨 VARIANTES - Diferentes estilos visuales */
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
          }
        `;
      case 'secondary':
        return css`
          background: #f3f4f6;
          color: #1f2937;

          &:hover:not(:disabled) {
            background: #e5e7eb;
          }

          &:active:not(:disabled) {
            background: #d1d5db;
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;

          &:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.1);
          }

          &:active:not(:disabled) {
            background: rgba(102, 126, 234, 0.2);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: #6b7280;

          &:hover:not(:disabled) {
            background: #f3f4f6;
          }

          &:active:not(:disabled) {
            background: #e5e7eb;
          }
        `;
    }
  }}

  /* 📱 FULL WIDTH - Para móviles */
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  /* ⏳ LOADING STATE - Spinner animado */
  ${({ isLoading }) =>
    isLoading &&
    css`
      color: transparent;
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid currentColor;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}

  /* 📱 RESPONSIVE - Touch targets en móvil */
  @media (max-width: 768px) {
    min-height: 48px; /* iOS recomienda 44px mínimo para touch */
    
    ${({ size }) =>
      size === 'sm' &&
      css`
        min-height: 40px;
      `}
  }
`;

// ⚛️ COMPONENTE: Usando forwardRef para acceso al DOM
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, isLoading, disabled, ...props }, ref) => {
      return (
        <StyledButton 
          ref={ref} 
          disabled={disabled || isLoading} 
          isLoading={isLoading} 
          {...props}
          // Accesibilidad: aria-busy cuando está cargando
          aria-busy={isLoading}
          aria-disabled={disabled || isLoading}
        >
          {children}
        </StyledButton>
      );
    }
  )
);

Button.displayName = 'Button';