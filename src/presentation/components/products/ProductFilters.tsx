// src/presentation/components/products/ProductFilters.tsx
'use client';

import styled from 'styled-components';
import { useState, useCallback, useMemo, memo } from 'react';
import { ProductCategory } from '@/src/core/domain/entities/Product';
import { ProductFilter, SortOption } from '@/src/core/domain/value-objects/ProductFilter';
import { Button } from '../ui/Button';

interface ProductFiltersProps {
  selectedCategories: ProductCategory[];
  priceRange: { min: number; max: number };
  searchQuery: string;
  minRating: number;
  sortBy: SortOption;
  
  onCategoryChange: (categories: ProductCategory[]) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onSearchChange: (query: string) => void;
  onMinRatingChange: (rating: number) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  
  totalResults?: number;
  isLoading?: boolean;
}

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const SearchInputCompact = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: white;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    order: 1;
  }
`;

const FilterToggleButton = styled.button<{ $hasActiveFilters: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.$hasActiveFilters ? '#f59e0b' : 'white'};
  color: ${props => props.$hasActiveFilters ? 'white' : '#374151'};
  border: 2px solid ${props => props.$hasActiveFilters ? '#f59e0b' : '#e5e7eb'};
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #f59e0b;
    background: ${props => props.$hasActiveFilters ? '#d97706' : 'rgba(245, 158, 11, 0.05)'};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    order: 2;
    flex: 1;
  }
`;

const SortSelectCompact = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &:hover {
    border-color: #f59e0b;
  }

  @media (max-width: 768px) {
    order: 3;
    flex: 1;
  }
`;

const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: ${props => props.color || 'white'};
  color: ${props => props.color ? 'white' : '#f59e0b'};
  border-radius: 0.625rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.375rem;
`;

const ResultsCount = styled.div`
  padding: 0.75rem 1.25rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;

  strong {
    color: #1f2937;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    order: 4;
    width: 100%;
    text-align: center;
  }
`;

const FilterDrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
`;

const FilterDrawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background: white;
  z-index: 999;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const DrawerTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
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
    transform: scale(0.95) rotate(90deg);
  }
`;

const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const DrawerFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  display: flex;
  gap: 1rem;
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.875rem;
  font-size: 0.9375rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const CategoryButton = styled.button<{ $isActive: boolean }>`
  padding: 0.625rem 0.875rem;
  border: 2px solid ${props => (props.$isActive ? '#f59e0b' : '#e5e7eb')};
  background: ${props => (props.$isActive ? 'rgba(245, 158, 11, 0.1)' : 'white')};
  color: ${props => (props.$isActive ? '#f59e0b' : '#6b7280')};
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PriceInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: center;
`;

const PriceInput = styled.input`
  padding: 0.625rem 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  transition: all 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const Separator = styled.span`
  color: #9ca3af;
  font-weight: 600;
  text-align: center;
  font-size: 0.875rem;
`;

const RatingStars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RatingStar = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border: 2px solid ${props => (props.$isActive ? '#f59e0b' : '#e5e7eb')};
  background: ${props => (props.$isActive ? 'rgba(245, 158, 11, 0.1)' : 'white')};
  color: ${props => (props.$isActive ? '#f59e0b' : '#6b7280')};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: flex-start;

  &:hover {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }

  span {
    color: #fbbf24;
    font-size: 1rem;
  }
`;

const categories: ProductCategory[] = [
  'raw-honey',
  'flavored-honey',
  'honeycomb',
  'bee-products',
  'skincare',
  'supplements',
];

const categoryLabels: Record<ProductCategory, string> = {
  'raw-honey': '🍯 Raw Honey',
  'flavored-honey': '🌸 Flavored',
  'honeycomb': '🐝 Honeycomb',
  'bee-products': '🌼 Bee Products',
  'skincare': '✨ Skincare',
  'supplements': '💊 Supplements',
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'popularity-desc', label: 'Popular' },
  { value: 'name-asc', label: 'A-Z' },
  { value: 'name-desc', label: 'Z-A' },
];

const ratingOptions = [
  { value: 0, label: 'All Ratings', icon: '★★★★★' },
  { value: 4, label: '4+ Stars', icon: '★★★★' },
  { value: 4.5, label: '4.5+ Stars', icon: '★★★★½' },
];

export const ProductFilters = memo(({
  selectedCategories,
  priceRange,
  searchQuery,
  minRating,
  sortBy,
  onCategoryChange,
  onPriceRangeChange,
  onSearchChange,
  onMinRatingChange,
  onSortChange,
  onReset,
  totalResults = 0,
  isLoading = false,
}: ProductFiltersProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCategoryToggle = useCallback((category: ProductCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  }, [selectedCategories, onCategoryChange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (priceRange.min > 0 || priceRange.max < 1000) count++;
    if (minRating > 0) count++;
    return count;
  }, [selectedCategories.length, priceRange, minRating]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      <FilterBar>
        <SearchInputCompact
          type="text"
          placeholder="🔍 Search honey products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
        />

        <FilterToggleButton
          $hasActiveFilters={activeFiltersCount > 0}
          onClick={() => setIsDrawerOpen(true)}
          disabled={isLoading}
        >
          <span>⚙️</span>
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <FilterBadge>{activeFiltersCount}</FilterBadge>
          )}
        </FilterToggleButton>

        <SortSelectCompact
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          disabled={isLoading}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SortSelectCompact>

        {totalResults > 0 && (
          <ResultsCount>
            <strong>{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}
          </ResultsCount>
        )}
      </FilterBar>

      <FilterDrawerOverlay $isOpen={isDrawerOpen} onClick={handleCloseDrawer} />
      
      <FilterDrawer $isOpen={isDrawerOpen}>
        <DrawerHeader>
          <DrawerTitle>
            ⚙️ Filters
            {activeFiltersCount > 0 && (
              <FilterBadge color="#f59e0b">{activeFiltersCount}</FilterBadge>
            )}
          </DrawerTitle>
          <CloseButton onClick={handleCloseDrawer} aria-label="Close filters">
            ✕
          </CloseButton>
        </DrawerHeader>

        <DrawerContent>
          <FilterSection>
            <FilterLabel>Categories</FilterLabel>
            <CategoryGrid>
              {categories.map(category => (
                <CategoryButton
                  key={category}
                  $isActive={selectedCategories.includes(category)}
                  onClick={() => handleCategoryToggle(category)}
                  disabled={isLoading}
                  title={categoryLabels[category]}
                >
                  {categoryLabels[category]}
                </CategoryButton>
              ))}
            </CategoryGrid>
          </FilterSection>

          <FilterSection>
            <FilterLabel>Price Range</FilterLabel>
            <PriceInputs>
              <PriceInput
                type="number"
                placeholder="Min"
                value={priceRange.min || ''}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    min: Number(e.target.value) || 0,
                  })
                }
                min={0}
                disabled={isLoading}
              />
              <Separator>—</Separator>
              <PriceInput
                type="number"
                placeholder="Max"
                value={priceRange.max || ''}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    max: Number(e.target.value) || 1000,
                  })
                }
                min={0}
                disabled={isLoading}
              />
            </PriceInputs>
          </FilterSection>

          <FilterSection>
            <FilterLabel>Minimum Rating</FilterLabel>
            <RatingStars>
              {ratingOptions.map(option => (
                <RatingStar
                  key={option.value}
                  $isActive={minRating === option.value}
                  onClick={() => onMinRatingChange(option.value)}
                  disabled={isLoading}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </RatingStar>
              ))}
            </RatingStars>
          </FilterSection>
        </DrawerContent>

        <DrawerFooter>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={onReset}
            disabled={isLoading || activeFiltersCount === 0}
          >
            Clear All
          </Button>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleApplyFilters}
            disabled={isLoading}
          >
            Apply
          </Button>
        </DrawerFooter>
      </FilterDrawer>
    </>
  );
});

ProductFilters.displayName = 'ProductFilters';