"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';

// Types pour les produits reconditionnés
interface ReconditionedProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price: number;
  condition: string;
  warranty_months: number;
  features: string[];
  description: string;
  image_url: string;
  is_available: boolean;
  stock_quantity: number;
  created_at: string;
  average_rating: number;
  review_count: number;
  savings_percentage: number;
  specifications?: Record<string, string>;
  reconditioning_details?: string[];
}

interface ProductsContextType {
  products: ReconditionedProduct[];
  selectedProduct: ReconditionedProduct | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  selectedBrand: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearError: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<ReconditionedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ReconditionedProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Récupération des produits avec filtres:', { searchTerm, selectedCategory, selectedBrand });
      const data = await apiClient.getPublicProducts(searchTerm, selectedCategory, selectedBrand);
      console.log('Produits récupérés:', data);
      setProducts(data as ReconditionedProduct[]);
    } catch (err) {
      console.error('Erreur lors de la récupération des produits:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Récupération du produit par ID:', id);
      const data = await apiClient.getPublicProduct(id);
      console.log('Produit récupéré:', data);
      setSelectedProduct(data as ReconditionedProduct);
    } catch (err) {
      console.error('Erreur lors de la récupération du produit:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération du produit');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Récupérer les produits quand les filtres changent
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedBrand]);

  const value: ProductsContextType = {
    products,
    selectedProduct,
    loading,
    error,
    searchTerm,
    selectedCategory,
    selectedBrand,
    setSearchTerm,
    setSelectedCategory,
    setSelectedBrand,
    fetchProducts,
    fetchProductById,
    clearError,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}; 