export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000, // 10 secondes
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  REPAIRS: {
    LIST: '/repairs',
    CREATE: '/repairs',
    GET: (id: string) => `/repairs/${id}`,
    UPDATE: (id: string) => `/repairs/${id}`,
    DELETE: (id: string) => `/repairs/${id}`,
  },
  DONATIONS: {
    LIST: '/donations',
    CREATE: '/donations',
    GET: (id: string) => `/donations/${id}`,
    UPDATE: (id: string) => `/donations/${id}`,
    DELETE: (id: string) => `/donations/${id}`,
  },
  PRODUCTS: {
    LIST: '/products',
    GET: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
}; 