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

const FiltersContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryButton = styled.button<{ $isActive: boolean }>`
  padding: 0.625rem 1rem;
  border: 2px solid ${props => (props.$isActive ? '#f59e0b' : '#e5e7eb')};
  background: ${props => (props.$isActive ? 'rgba(245, 158, 11, 0.1)' : 'white')};
  color: ${props => (props.$isActive ? '#f59e0b' : '#6b7280')};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
  white-space: nowrap;

  &:hover {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const PriceInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: center;
`;

const PriceInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  /* Ocultar flechas de number input */
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
`;

const RatingStars = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RatingStar = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 2px solid ${props => (props.$isActive ? '#f59e0b' : '#e5e7eb')};
  background: ${props => (props.$isActive ? 'rgba(245, 158, 11, 0.1)' : 'white')};
  color: ${props => (props.$isActive ? '#f59e0b' : '#6b7280')};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
  }

  span {
    color: #fbbf24;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;

  strong {
    color: #1f2937;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
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
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'popularity-desc', label: 'Most Popular' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

const ratingOptions = [
  { value: 0, label: 'All Ratings' },
  { value: 4, label: '4+ Stars' },
  { value: 4.5, label: '4.5+ Stars' },
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
    if (searchQuery) count++;
    if (minRating > 0) count++;
    return count;
  }, [selectedCategories.length, priceRange, searchQuery, minRating]);

  return (
    <FiltersContainer>
      <FilterSection>
        <FilterLabel htmlFor="search">
          Search Products
        </FilterLabel>
        <SearchInput
          id="search"
          type="text"
          placeholder="Search honey products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
        />
      </FilterSection>

      <FilterSection>
        <FilterLabel>Categories</FilterLabel>
        <CategoryGrid>
          {categories.map(category => (
            <CategoryButton
              key={category}
              $isActive={selectedCategories.includes(category)}
              onClick={() => handleCategoryToggle(category)}
              disabled={isLoading}
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
              <span>★</span>
              {option.label}
            </RatingStar>
          ))}
        </RatingStars>
      </FilterSection>

      <FilterSection>
        <FilterLabel htmlFor="sort">Sort By</FilterLabel>
        <Select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          disabled={isLoading}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FilterSection>

      {totalResults > 0 && (
        <ResultsInfo>
          <span>
            Found <strong>{totalResults}</strong> product{totalResults !== 1 ? 's' : ''}
          </span>
          {activeFiltersCount > 0 && (
            <span>
              <strong>{activeFiltersCount}</strong> filter{activeFiltersCount !== 1 ? 's' : ''} active
            </span>
          )}
        </ResultsInfo>
      )}

      <FilterActions>
        <Button 
          variant="outline" 
          fullWidth 
          onClick={onReset}
          disabled={isLoading || activeFiltersCount === 0}
        >
          Reset Filters
        </Button>
      </FilterActions>
    </FiltersContainer>
  );
});

ProductFilters.displayName = 'ProductFilters';