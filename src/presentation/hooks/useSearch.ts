// src/presentation/hooks/useSearch.ts
import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/src/core/domain/entities/Product';
import { MOCK_HONEY_PRODUCTS } from '@/src/infrastucture/mock-data/products.mock';
import { useDebounce } from './useDebounce';

export interface SearchResult {
  product: Product;
  matchScore: number;
  matchType: 'name' | 'category' | 'description' | 'features';
}

const SEARCH_HISTORY_KEY = 'royal-honey-search-history';
const MAX_HISTORY_ITEMS = 5;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  // Cargar historial desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        try {
          setSearchHistory(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading search history:', error);
        }
      }
    }
  }, []);

  // Guardar en historial
  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== searchQuery);
      const newHistory = [searchQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      }
      
      return newHistory;
    });
  };

  // Limpiar historial
  const clearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
  };

  // Búsqueda con scoring
  const results = useMemo<SearchResult[]>(() => {
    if (!debouncedQuery.trim()) return [];

    const queryLower = debouncedQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    MOCK_HONEY_PRODUCTS.forEach((product) => {
      let matchScore = 0;
      let matchType: SearchResult['matchType'] = 'description';

      // Nombre del producto (peso más alto)
      if (product.name.toLowerCase().includes(queryLower)) {
        matchScore += 100;
        matchType = 'name';
      }

      // Categoría
      if (product.category.toLowerCase().includes(queryLower)) {
        matchScore += 50;
        if (matchScore < 100) matchType = 'category';
      }

      // Descripción
      if (product.description.toLowerCase().includes(queryLower)) {
        matchScore += 30;
        if (matchScore < 100) matchType = 'description';
      }

      // Features
      const featureMatch = product.features.some((feature) =>
        feature.toLowerCase().includes(queryLower)
      );
      if (featureMatch) {
        matchScore += 20;
        if (matchScore < 100) matchType = 'features';
      }

      // Coincidencia exacta al inicio (bonus)
      if (product.name.toLowerCase().startsWith(queryLower)) {
        matchScore += 50;
      }

      if (matchScore > 0) {
        searchResults.push({ product, matchScore, matchType });
      }
    });

    // Ordenar por score descendente
    return searchResults.sort((a, b) => b.matchScore - a.matchScore);
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    isSearching: query !== debouncedQuery,
    searchHistory,
    saveToHistory,
    clearHistory,
  };
}