'use client';

import styled from 'styled-components';
import { HTMLAttributes, forwardRef, memo } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
}

interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
}

const StyledCard = styled.div<CardProps>`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 
              0 1px 2px rgba(0, 0, 0, 0.06);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  
  will-change: transform, box-shadow;

  ${({ hoverable = true }) =>
    hoverable &&
    `
    &:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12),
                  0 4px 8px rgba(0, 0, 0, 0.08);
      
      transform: translateY(-4px);
    }

    &:active {
      transform: translateY(-2px);
    }
  `}

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px); /* Menos movimiento en móvil */
    }
  }

  &:focus-within {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

export const Card = memo(
  forwardRef<HTMLDivElement, CardProps>(
    ({ children, hoverable = true, clickable = false, ...props }, ref) => {
      return (
        <StyledCard 
          ref={ref} 
          hoverable={hoverable} 
          clickable={clickable}
          {...props}
        >
          {children}
        </StyledCard>
      );
    }
  )
);

Card.displayName = 'Card';

const StyledCardImage = styled.div<CardImageProps>`
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;

  ${({ aspectRatio = '16/9' }) => {
    if (aspectRatio === 'auto') return '';
    
    const ratios = {
      '16/9': '56.25%',
      '4/3': '75%',
      '1/1': '100%',
    };

    return `
      padding-top: ${ratios[aspectRatio]};
    `;
  }}

  img, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cubre todo el espacio sin distorsionar */
    
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${StyledCard}:hover & img,
  ${StyledCard}:hover & video {
    transform: scale(1.05); /* Zoom sutil del 5% */
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.3) 0%,
      transparent 100%
    );
    pointer-events: none; /* No bloquea clicks */
  }
`;

export const CardImage = memo(
  forwardRef<HTMLDivElement, CardImageProps>(
    ({ children, aspectRatio = '16/9', ...props }, ref) => {
      return (
        <StyledCardImage ref={ref} aspectRatio={aspectRatio} {...props}>
          {children}
        </StyledCardImage>
      );
    }
  )
);

CardImage.displayName = 'CardImage';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
}

const StyledCardContent = styled.div<CardContentProps>`
  padding: ${({ padding = 'md' }) => {
    switch (padding) {
      case 'sm':
        return '1rem';
      case 'lg':
        return '2rem';
      default:
        return '1.5rem';
    }
  }};

  @media (max-width: 768px) {
    padding: ${({ padding = 'md' }) => {
      switch (padding) {
        case 'sm':
          return '0.75rem';
        case 'lg':
          return '1.5rem';
        default:
          return '1.25rem';
      }
    }};
  }
`;

export const CardContent = memo(
  forwardRef<HTMLDivElement, CardContentProps>(
    ({ children, padding = 'md', ...props }, ref) => {
      return (
        <StyledCardContent ref={ref} padding={padding} {...props}>
          {children}
        </StyledCardContent>
      );
    }
  )
);

CardContent.displayName = 'CardContent';

export const CardHeader = styled.div`
  margin-bottom: 1rem;

  /* 📱 Responsive spacing */
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: color 0.2s ease;

  ${StyledCard}:hover & {
    color: #667eea; /* Cambia a color primario en hover */
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    -webkit-line-clamp: 2; /* Solo 2 líneas en móvil */
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

export const CardBadgeContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 10; /* Por encima de la imagen */
  gap: 0.5rem;

  @media (max-width: 768px) {
    top: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
  }
`;