"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from './AuthContext';

// Types pour les réparations
interface Repair {
  id: number;
  reference_code: string;
  user_id: number;
  appliance_type_id: number;
  brand_id?: number;
  model?: string;
  issue_description: string;
  status: 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  base_price: number;
  additional_cost: number;
  total_cost: number;
  scheduled_date?: string;
  scheduled_time_slot?: string;
  technician_notes?: string;
  created_at: string;
  updated_at: string;
}

interface RepairsContextType {
  repairs: Repair[];
  selectedRepair: Repair | null;
  loading: boolean;
  error: string | null;
  fetchRepairs: () => Promise<void>;
  fetchRepairById: (id: string) => Promise<void>;
  createRepair: (data: any) => Promise<Repair>;
  updateRepair: (id: string, data: any) => Promise<Repair>;
  clearError: () => void;
}

const RepairsContext = createContext<RepairsContextType | undefined>(undefined);

export const useRepairs = () => {
  const context = useContext(RepairsContext);
  if (context === undefined) {
    throw new Error('useRepairs must be used within a RepairsProvider');
  }
  return context;
};

interface RepairsProviderProps {
  children: ReactNode;
}

export const RepairsProvider: React.FC<RepairsProviderProps> = ({ children }) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchRepairs = async () => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour accéder aux réparations');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Récupération des réparations...');
      const data = await apiClient.getRepairs();
      console.log('Réparations récupérées:', data);
      setRepairs(data as Repair[]);
    } catch (err) {
      console.error('Erreur lors de la récupération des réparations:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des réparations');
    } finally {
      setLoading(false);
    }
  };

  const fetchRepairById = async (id: string) => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour accéder aux réparations');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Récupération de la réparation par ID:', id);
      const data = await apiClient.getRepair(id);
      console.log('Réparation récupérée:', data);
      setSelectedRepair(data as Repair);
    } catch (err) {
      console.error('Erreur lors de la récupération de la réparation:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération de la réparation');
    } finally {
      setLoading(false);
    }
  };

  const createRepair = async (data: any): Promise<Repair> => {
    if (!isAuthenticated) {
      throw new Error('Vous devez être connecté pour créer une réparation');
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Création d\'une nouvelle réparation:', data);
      const newRepair = await apiClient.createRepair(data);
      console.log('Réparation créée:', newRepair);
      setRepairs(prev => [...prev, newRepair as Repair]);
      return newRepair as Repair;
    } catch (err) {
      console.error('Erreur lors de la création de la réparation:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la réparation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRepair = async (id: string, data: any): Promise<Repair> => {
    if (!isAuthenticated) {
      throw new Error('Vous devez être connecté pour modifier une réparation');
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Mise à jour de la réparation:', id, data);
      const updatedRepair = await apiClient.updateRepair(id, data);
      console.log('Réparation mise à jour:', updatedRepair);
      setRepairs(prev => prev.map(repair => repair.id === parseInt(id) ? updatedRepair as Repair : repair));
      return updatedRepair as Repair;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la réparation:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la réparation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Récupérer les réparations quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchRepairs();
    }
  }, [isAuthenticated]);

  const value: RepairsContextType = {
    repairs,
    selectedRepair,
    loading,
    error,
    fetchRepairs,
    fetchRepairById,
    createRepair,
    updateRepair,
    clearError,
  };

  return (
    <RepairsContext.Provider value={value}>
      {children}
    </RepairsContext.Provider>
  );
}; 