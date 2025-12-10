// src/presentation/components/layout/SearchBar.tsx
'use client';

import styled from 'styled-components';
import { memo, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/src/presentation/hooks/useSearch';
import Link from 'next/link';

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;

  @media (max-width: 968px) {
    max-width: 300px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  font-size: 1.25rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 3rem;
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  font-family: inherit;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    background: white;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d1d5db;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #9ca3af;
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-8px')});
  transition: all 0.2s ease;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;

    &:hover {
      background: #9ca3af;
    }
  }
`;

const DropdownSection = styled.div`
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const SectionTitle = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClearHistoryButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-transform: none;
  letter-spacing: normal;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const HistoryItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  transition: background 0.2s ease;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9375rem;
  color: #1f2937;

  &:hover {
    background: #f9fafb;
  }
`;

const ResultImage = styled.div<{ $category: string }>`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: ${({ $category }) => {
    const gradients: Record<string, string> = {
      'raw-honey': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'flavored-honey': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      'honeycomb': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      'bee-products': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'skincare': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      'supplements': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    };
    return gradients[$category] || gradients['raw-honey'];
  }};
`;

const ResultContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #6b7280;
`;

const ResultPrice = styled.div`
  font-weight: 700;
  color: #f59e0b;
  font-size: 1rem;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
`;

const LoadingState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const MatchBadge = styled.span<{ $type: string }>`
  padding: 0.125rem 0.5rem;
  background: ${({ $type }) => {
    switch ($type) {
      case 'name':
        return 'rgba(102, 126, 234, 0.1)';
      case 'category':
        return 'rgba(245, 158, 11, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'name':
        return '#667eea';
      case 'category':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
`;

export const SearchBar = memo(function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    query,
    setQuery,
    debouncedQuery,
    results,
    isSearching,
    searchHistory,
    saveToHistory,
    clearHistory,
  } = useSearch();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Abrir dropdown cuando hay query o historial
  useEffect(() => {
    if (query || searchHistory.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [query, searchHistory]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSelectResult = (productSlug: string) => {
    saveToHistory(query);
    setIsDropdownOpen(false);
    setQuery('');
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const showHistory = !query && searchHistory.length > 0;
  const showResults = debouncedQuery && results.length > 0;
  const showEmpty = debouncedQuery && !isSearching && results.length === 0;
  const showDropdown = isDropdownOpen && (showHistory || showResults || showEmpty || isSearching);

  return (
    <SearchWrapper ref={wrapperRef}>
      <SearchInputWrapper>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="Search honey products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
        />
        {query && <ClearButton onClick={handleClear}>✕</ClearButton>}
      </SearchInputWrapper>

      <Dropdown $isOpen={showDropdown}>
        {/* Loading State */}
        {isSearching && (
          <LoadingState>
            <Spinner />
            <span>Searching...</span>
          </LoadingState>
        )}

        {/* Search Results */}
        {showResults && !isSearching && (
          <DropdownSection>
            <SectionTitle>
              Products ({results.length})
            </SectionTitle>
            {results.slice(0, 5).map(({ product, matchType }) => (
              <ResultItem
                key={product.id.value}
                href={`/products/${product.slug}`}
                onClick={() => handleSelectResult(product.slug)}
              >
                <ResultImage $category={product.category}>
                  {product.name.charAt(0)}
                </ResultImage>
                <ResultContent>
                  <ResultName>{product.name}</ResultName>
                  <ResultMeta>
                    <MatchBadge $type={matchType}>in {matchType}</MatchBadge>
                    <span>•</span>
                    <span>{product.category.replace('-', ' ')}</span>
                  </ResultMeta>
                </ResultContent>
                <ResultPrice>${product.price.amount.toFixed(2)}</ResultPrice>
              </ResultItem>
            ))}
          </DropdownSection>
        )}

        {/* Empty State */}
        {showEmpty && (
          <EmptyState>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <div>No products found for &quot;{debouncedQuery}&quot;</div>
          </EmptyState>
        )}

        {/* Search History */}
        {showHistory && (
          <DropdownSection>
            <SectionTitle>
              Recent Searches
              <ClearHistoryButton onClick={clearHistory}>Clear</ClearHistoryButton>
            </SectionTitle>
            {searchHistory.map((historyQuery, index) => (
              <HistoryItem key={index} onClick={() => handleHistoryClick(historyQuery)}>
                <span style={{ color: '#9ca3af' }}>🕐</span>
                <span>{historyQuery}</span>
              </HistoryItem>
            ))}
          </DropdownSection>
        )}
      </Dropdown>
    </SearchWrapper>
  );
});