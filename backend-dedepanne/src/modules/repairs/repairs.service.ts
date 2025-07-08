import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairRequest, RepairRequestHistory, Intervention, InterventionHistory, RepairStatus, InterventionStatus } from '../../database/entities/repair.entity';
import { CreateRepairRequestDto } from './dto/create-repair-request.dto';
import { UpdateRepairRequestDto } from './dto/update-repair-request.dto';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';

@Injectable()
export class RepairsService {
  constructor(
    @InjectRepository(RepairRequest)
    private repairRequestRepository: Repository<RepairRequest>,
    @InjectRepository(RepairRequestHistory)
    private repairRequestHistoryRepository: Repository<RepairRequestHistory>,
    @InjectRepository(Intervention)
    private interventionRepository: Repository<Intervention>,
    @InjectRepository(InterventionHistory)
    private interventionHistoryRepository: Repository<InterventionHistory>,
  ) {}

  async createRepairRequest(createRepairRequestDto: CreateRepairRequestDto, userId: number): Promise<RepairRequest> {
    const referenceCode = this.generateReferenceCode('REP');
    
    const repairRequest = this.repairRequestRepository.create({
      ...createRepairRequestDto,
      user_id: userId,
      reference_code: referenceCode,
      total_cost: createRepairRequestDto.base_price + (createRepairRequestDto.additional_cost || 0),
    });

    const savedRepairRequest = await this.repairRequestRepository.save(repairRequest);

    // Créer l'historique initial
    await this.createRepairRequestHistory(savedRepairRequest.id, 'en attente', 'Demande de réparation créée');

    return savedRepairRequest;
  }

  async findAllRepairRequests(userId: number, role: string): Promise<RepairRequest[]> {
    const query = this.repairRequestRepository.createQueryBuilder('repair')
      .leftJoinAndSelect('repair.user', 'user')
      .leftJoinAndSelect('repair.history', 'history')
      .orderBy('repair.created_at', 'DESC');

    if (role === 'client') {
      query.where('repair.user_id = :userId', { userId });
    }

    return query.getMany();
  }

  async findRepairRequestById(id: number, userId: number, role: string): Promise<RepairRequest> {
    const query = this.repairRequestRepository.createQueryBuilder('repair')
      .leftJoinAndSelect('repair.user', 'user')
      .leftJoinAndSelect('repair.history', 'history')
      .leftJoinAndSelect('repair.interventions', 'interventions')
      .leftJoinAndSelect('interventions.history', 'interventionHistory')
      .where('repair.id = :id', { id });

    if (role === 'client') {
      query.andWhere('repair.user_id = :userId', { userId });
    }

    const repairRequest = await query.getOne();

    if (!repairRequest) {
      throw new NotFoundException('Demande de réparation non trouvée');
    }

    return repairRequest;
  }

  async updateRepairRequest(id: number, updateRepairRequestDto: UpdateRepairRequestDto, userId: number, role: string): Promise<RepairRequest> {
    const repairRequest = await this.findRepairRequestById(id, userId, role);

    // Mettre à jour les champs
    Object.assign(repairRequest, updateRepairRequestDto);
    
    if (updateRepairRequestDto.base_price || updateRepairRequestDto.additional_cost) {
      repairRequest.total_cost = (updateRepairRequestDto.base_price || repairRequest.base_price) + 
                               (updateRepairRequestDto.additional_cost || repairRequest.additional_cost);
    }

    const updatedRepairRequest = await this.repairRequestRepository.save(repairRequest);

    // Créer l'historique si le statut a changé
    if (updateRepairRequestDto.status && updateRepairRequestDto.status !== repairRequest.status) {
      await this.createRepairRequestHistory(id, updateRepairRequestDto.status, updateRepairRequestDto.technician_notes);
    }

    return updatedRepairRequest;
  }

  async createIntervention(repairRequestId: number, createInterventionDto: CreateInterventionDto, userId: number): Promise<Intervention> {
    const repairRequest = await this.findRepairRequestById(repairRequestId, userId, 'technician');

    const intervention = this.interventionRepository.create({
      ...createInterventionDto,
      repair_request_id: repairRequestId,
    });

    const savedIntervention = await this.interventionRepository.save(intervention);

    // Créer l'historique initial
    await this.createInterventionHistory(savedIntervention.id, 'en cours', 'Intervention démarrée');

    return savedIntervention;
  }

  async updateIntervention(interventionId: number, updateInterventionDto: UpdateInterventionDto, userId: number): Promise<Intervention> {
    const intervention = await this.interventionRepository.findOne({
      where: { id: interventionId },
      relations: ['repair_request'],
    });

    if (!intervention) {
      throw new NotFoundException('Intervention non trouvée');
    }

    // Vérifier que l'utilisateur est le technicien assigné ou admin
    if (intervention.repair_request.user_id !== userId) {
      throw new BadRequestException('Non autorisé à modifier cette intervention');
    }

    Object.assign(intervention, updateInterventionDto);
    const updatedIntervention = await this.interventionRepository.save(intervention);

    // Créer l'historique si le statut a changé
    if (updateInterventionDto.status && updateInterventionDto.status !== intervention.status) {
      await this.createInterventionHistory(interventionId, updateInterventionDto.status, updateInterventionDto.commentaire);
    }

    return updatedIntervention;
  }

  async finalizeIntervention(interventionId: number, userId: number): Promise<Intervention> {
    const intervention = await this.interventionRepository.findOne({
      where: { id: interventionId },
      relations: ['repair_request'],
    });

    if (!intervention) {
      throw new NotFoundException('Intervention non trouvée');
    }

    // Finaliser l'intervention
    intervention.status = InterventionStatus.COMPLETED;
    intervention.end_time = new Date().toTimeString().split(' ')[0];
    
    const updatedIntervention = await this.interventionRepository.save(intervention);

    // Créer l'historique
    await this.createInterventionHistory(interventionId, 'terminée', 'Intervention finalisée');

    // Mettre à jour le statut de la demande de réparation
    await this.updateRepairRequest(
      intervention.repair_request_id,
      { status: RepairStatus.COMPLETED },
      userId,
      'technician'
    );

    return updatedIntervention;
  }

  private async createRepairRequestHistory(repairRequestId: number, status: string, commentaire?: string): Promise<RepairRequestHistory> {
    const history = this.repairRequestHistoryRepository.create({
      repair_request_id: repairRequestId,
      status,
      commentaire,
    });

    return this.repairRequestHistoryRepository.save(history);
  }

  private async createInterventionHistory(interventionId: number, status: string, commentaire?: string): Promise<InterventionHistory> {
    const history = this.interventionHistoryRepository.create({
      intervention_id: interventionId,
      status,
      commentaire,
    });

    return this.interventionHistoryRepository.save(history);
  }

  private generateReferenceCode(prefix: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }
} 