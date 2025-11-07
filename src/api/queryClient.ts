import { QueryClient } from '@tanstack/react-query'

// Create React Query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 min
      gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on reconnect
    },
    mutations: {
      retry: 1, // Only retry mutations once
      retryDelay: 1000,
    },
  },
})

// Query keys factory for organized cache keys
export const queryKeys = {
  // Material database queries
  materials: {
    all: ['materials'] as const,
    list: (filters?: MaterialFilters) => ['materials', 'list', filters] as const,
    detail: (id: string) => ['materials', 'detail', id] as const,
    search: (query: string) => ['materials', 'search', query] as const,
    categories: () => ['materials', 'categories'] as const,
    manufacturers: () => ['materials', 'manufacturers'] as const,
  },

  // Climate asset queries
  climate: {
    all: ['climate'] as const,
    list: (filters?: ClimateFilters) => ['climate', 'list', filters] as const,
    detail: (id: string) => ['climate', 'detail', id] as const,
    weatherStations: (region?: string) => ['climate', 'weatherStations', region] as const,
  },

  // Simulation queries
  simulations: {
    all: ['simulations'] as const,
    list: () => ['simulations', 'list'] as const,
    detail: (id: string) => ['simulations', 'detail', id] as const,
    status: (id: string) => ['simulations', 'status', id] as const,
    results: (id: string) => ['simulations', 'results', id] as const,
  },

  // Project queries
  projects: {
    all: ['projects'] as const,
    list: () => ['projects', 'list'] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
  },

  // Schema/validation queries
  schemas: {
    all: ['schemas'] as const,
    simulation: () => ['schemas', 'simulation'] as const,
    material: () => ['schemas', 'material'] as const,
  },
}

// Type definitions for filters
export interface MaterialFilters {
  category?: string
  manufacturer?: string
  sortBy?: 'name' | 'category' | 'manufacturer'
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface ClimateFilters {
  region?: string
  type?: 'weather-station' | 'standard' | 'custom'
  search?: string
}

export default queryClient
