"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from './AuthContext';

// Types pour les dons
interface Donation {
  id: number;
  user_id: number;
  reference_code: string;
  appliance_type_id: number;
  brand_id?: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'processed' | 'completed' | 'cancelled';
  pickup_date?: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface DonationsContextType {
  donations: Donation[];
  selectedDonation: Donation | null;
  loading: boolean;
  error: string | null;
  fetchDonations: () => Promise<void>;
  createDonation: (data: any) => Promise<Donation>;
  clearError: () => void;
}

const DonationsContext = createContext<DonationsContextType | undefined>(undefined);

export const useDonations = () => {
  const context = useContext(DonationsContext);
  if (context === undefined) {
    throw new Error('useDonations must be used within a DonationsProvider');
  }
  return context;
};

interface DonationsProviderProps {
  children: ReactNode;
}

export const DonationsProvider: React.FC<DonationsProviderProps> = ({ children }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchDonations = async () => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour accéder aux dons');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Récupération des dons...');
      const data = await apiClient.getDonations();
      console.log('Dons récupérés:', data);
      setDonations(data as Donation[]);
    } catch (err) {
      console.error('Erreur lors de la récupération des dons:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des dons');
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (data: any): Promise<Donation> => {
    if (!isAuthenticated) {
      throw new Error('Vous devez être connecté pour créer un don');
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Création d\'un nouveau don:', data);
      const newDonation = await apiClient.createDonation(data);
      console.log('Don créé:', newDonation);
      setDonations(prev => [...prev, newDonation as Donation]);
      return newDonation as Donation;
    } catch (err) {
      console.error('Erreur lors de la création du don:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du don');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Récupérer les dons quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchDonations();
    }
  }, [isAuthenticated]);

  const value: DonationsContextType = {
    donations,
    selectedDonation,
    loading,
    error,
    fetchDonations,
    createDonation,
    clearError,
  };

  return (
    <DonationsContext.Provider value={value}>
      {children}
    </DonationsContext.Provider>
  );
}; 