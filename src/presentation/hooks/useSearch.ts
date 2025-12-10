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

// Función helper para cargar el historial
const loadSearchHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading search history:', error);
    return [];
  }
};

export function useSearch() {
  const [query, setQuery] = useState('');
  // Usar lazy initializer para evitar setState en useEffect
  const [searchHistory, setSearchHistory] = useState<string[]>(loadSearchHistory);
  const debouncedQuery = useDebounce(query, 300);

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