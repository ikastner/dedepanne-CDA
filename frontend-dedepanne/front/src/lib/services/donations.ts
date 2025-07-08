import { apiClient } from '../api';

export interface Donation {
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

export class DonationsService {
  // Récupérer toutes les donations
  static async getDonations(): Promise<Donation[]> {
    return apiClient.get<Donation[]>('/donations');
  }

  // Récupérer une donation par ID
  static async getDonation(id: number): Promise<Donation> {
    return apiClient.get<Donation>(`/donations/${id}`);
  }

  // Créer une nouvelle donation
  static async createDonation(data: Partial<Donation>): Promise<Donation> {
    return apiClient.post<Donation>('/donations', data);
  }

  // Mettre à jour le statut d'une donation
  static async updateDonationStatus(id: number, status: Donation['status']): Promise<Donation> {
    return apiClient.put<Donation>(`/donations/${id}`, { status });
  }
} 