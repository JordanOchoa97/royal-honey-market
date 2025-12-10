// src/presentation/components/ui/Card.tsx
'use client';

import styled from 'styled-components';
import { HTMLAttributes, forwardRef, memo } from 'react';

/**
 * 🎯 PATRÓN: Compound Components (Componentes Compuestos)
 * 
 * En lugar de tener un Card monolítico con muchas props,
 * creamos sub-componentes que se pueden combinar libremente:
 * 
 * <Card>
 *   <CardImage />
 *   <CardContent>
 *     <CardTitle />
 *     <CardDescription />
 *   </CardContent>
 * </Card>
 * 
 * VENTAJAS:
 * - Más flexible
 * - Más fácil de mantener
 * - Mejor composición
 * - TypeScript más simple
 */

// ============================================
// 📦 TIPOS BASE
// ============================================

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean; // Si debe tener efecto hover
  clickable?: boolean; // Si es clickeable (cambia cursor)
}

interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto'; // Relación de aspecto
}

// ============================================
// 🎨 COMPONENTE PRINCIPAL: Card
// ============================================

const StyledCard = styled.div<CardProps>`
  /* 📐 Layout Base */
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  
  /* 🎨 Sombras - Usando elevation system */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 
              0 1px 2px rgba(0, 0, 0, 0.06);
  
  /* 🎭 Transiciones suaves */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 🖱️ Cursor para cards clickeables */
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  
  /* ⚡ Optimización: will-change para animaciones suaves */
  will-change: transform, box-shadow;

  /* 🎯 Hover effect - solo si hoverable está activo */
  ${({ hoverable = true }) =>
    hoverable &&
    `
    &:hover {
      /* Elevation aumenta (Material Design pattern) */
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12),
                  0 4px 8px rgba(0, 0, 0, 0.08);
      
      /* Levantamos el card 4px */
      transform: translateY(-4px);
    }

    &:active {
      /* Al hacer click, vuelve un poco */
      transform: translateY(-2px);
    }
  `}

  /* 📱 RESPONSIVE: En móvil reducimos el hover effect */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px); /* Menos movimiento en móvil */
    }
  }

  /* 🎯 ACCESIBILIDAD: Focus visible para navegación por teclado */
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

// ============================================
// 🖼️ CARD IMAGE - Contenedor de imagen
// ============================================

/**
 * 🎯 TÉCNICA: Padding-Top Hack para aspect ratio
 * 
 * Antes de CSS aspect-ratio, usábamos padding-top % 
 * para mantener proporciones consistentes
 * 
 * 16:9 = (9/16) * 100 = 56.25%
 * 4:3 = (3/4) * 100 = 75%
 * 1:1 = 100%
 */

const StyledCardImage = styled.div<CardImageProps>`
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;

  /* 📐 Aspect Ratio - calculado dinámicamente */
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

  /* 🎨 Mejoras visuales para imágenes */
  img, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cubre todo el espacio sin distorsionar */
    
    /* 🎭 Transición suave en hover del card padre */
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ⚡ EFECTO: Zoom en la imagen cuando hacemos hover al card */
  ${StyledCard}:hover & img,
  ${StyledCard}:hover & video {
    transform: scale(1.05); /* Zoom sutil del 5% */
  }

  /* 🎨 Overlay gradient para mejorar legibilidad de texto sobre imagen */
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

// ============================================
// 📄 CARD CONTENT - Área de contenido
// ============================================

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
}

const StyledCardContent = styled.div<CardContentProps>`
  /* 📐 Padding responsive */
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

  /* 📱 Responsive padding en móvil */
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

// ============================================
// 🎯 CARD HEADER - Sección superior del contenido
// ============================================

export const CardHeader = styled.div`
  margin-bottom: 1rem;

  /* 📱 Responsive spacing */
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

// ============================================
// 📝 CARD TITLE - Título del card
// ============================================

/**
 * 🎯 TÉCNICA: Line Clamping
 * 
 * Limitamos el título a 2 líneas con ellipsis (...)
 * Útil para mantener heights consistentes en grids
 */

export const CardTitle = styled.h3`
  /* 📝 Tipografía */
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;

  /* ✂️ Line Clamping - Limitar a 2 líneas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* 🎭 Transición de color en hover */
  transition: color 0.2s ease;

  ${StyledCard}:hover & {
    color: #667eea; /* Cambia a color primario en hover */
  }

  /* 📱 Responsive font size */
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// ============================================
// 📄 CARD DESCRIPTION - Descripción
// ============================================

export const CardDescription = styled.p`
  /* 📝 Tipografía */
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;

  /* ✂️ Line Clamping - Limitar a 3 líneas */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* 📱 Responsive */
  @media (max-width: 768px) {
    font-size: 0.8125rem;
    -webkit-line-clamp: 2; /* Solo 2 líneas en móvil */
  }
`;

// ============================================
// 🦶 CARD FOOTER - Pie del card
// ============================================

export const CardFooter = styled.div`
  /* 📐 Layout flexbox */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  /* 🎨 Separador visual */
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;

  /* 📱 Responsive - Stack en móvil */
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

// ============================================
// 🎨 CARD BADGE CONTAINER - Para badges/tags
// ============================================

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

  /* 📱 Responsive spacing */
  @media (max-width: 768px) {
    top: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
  }
`;