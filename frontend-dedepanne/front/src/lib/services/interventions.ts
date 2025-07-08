import { apiClient } from '../api';

export interface Intervention {
  id: number;
  repair_request_id: number;
  date: string;
  start_time?: string;
  end_time?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  commentaire?: string;
  next_action?: string;
  created_at: string;
  updated_at: string;
}

export interface RepairRequest {
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
  interventions?: Intervention[];
}

export interface DashboardStats {
  totalInterventions: number;
  pendingInterventions: number;
  completedInterventions: number;
  totalRevenue: number;
  averageRating: number;
}

export class InterventionsService {
  // Récupérer toutes les interventions
  static async getInterventions(): Promise<Intervention[]> {
    return apiClient.get<Intervention[]>('/repairs/interventions');
  }

  // Récupérer les interventions en attente
  static async getPendingInterventions(): Promise<Intervention[]> {
    return apiClient.get<Intervention[]>('/repairs/interventions', { status: 'scheduled' });
  }

  // Récupérer les interventions en cours
  static async getInProgressInterventions(): Promise<Intervention[]> {
    return apiClient.get<Intervention[]>('/repairs/interventions', { status: 'in_progress' });
  }

  // Récupérer les demandes de réparation
  static async getRepairRequests(): Promise<RepairRequest[]> {
    return apiClient.get<RepairRequest[]>('/repairs');
  }

  // Récupérer les statistiques du dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [interventions, repairRequests] = await Promise.all([
        this.getInterventions(),
        this.getRepairRequests()
      ]);

      const totalInterventions = interventions.length;
      const pendingInterventions = interventions.filter(i => i.status === 'scheduled').length;
      const completedInterventions = interventions.filter(i => i.status === 'completed').length;
      const totalRevenue = repairRequests.reduce((sum, req) => sum + req.total_cost, 0);

      return {
        totalInterventions,
        pendingInterventions,
        completedInterventions,
        totalRevenue,
        averageRating: 4.8 // À implémenter plus tard
      };
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      return {
        totalInterventions: 0,
        pendingInterventions: 0,
        completedInterventions: 0,
        totalRevenue: 0,
        averageRating: 0
      };
    }
  }

  // Créer une nouvelle intervention
  static async createIntervention(repairRequestId: number, data: Partial<Intervention>): Promise<Intervention> {
    return apiClient.post<Intervention>(`/repairs/${repairRequestId}/interventions`, data);
  }

  // Mettre à jour une intervention
  static async updateIntervention(id: number, data: Partial<Intervention>): Promise<Intervention> {
    return apiClient.put<Intervention>(`/repairs/interventions/${id}`, data);
  }

  // Finaliser une intervention
  static async finalizeIntervention(id: number): Promise<Intervention> {
    return apiClient.put<Intervention>(`/repairs/interventions/${id}/finalize`);
  }
} 