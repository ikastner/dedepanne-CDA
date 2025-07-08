"use client"

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ProductsProvider } from './ProductsContext';
import { RepairsProvider } from './RepairsContext';
import { DonationsProvider } from './DonationsContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ProductsProvider>
        <RepairsProvider>
          <DonationsProvider>
            {children}
          </DonationsProvider>
        </RepairsProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}; 