import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate, IsEnum } from 'class-validator';
import { User } from '../../modules/users/entities/user.entity';

export enum RepairStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum InterventionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('repair_requests')
export class RepairRequest {
  @ApiProperty({ description: 'Identifiant unique de la demande' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Code de référence unique' })
  @Column({ unique: true })
  @IsString()
  reference_code: string;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  @Column()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Type d\'appareil' })
  @Column()
  @IsNumber()
  appliance_type_id: number;

  @ApiProperty({ description: 'Marque de l\'appareil' })
  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @ApiProperty({ description: 'Modèle de l\'appareil' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Description du problème' })
  @Column('text')
  @IsString()
  issue_description: string;

  @ApiProperty({ description: 'Statut de la demande', enum: RepairStatus })
  @Column({
    type: 'enum',
    enum: RepairStatus,
    default: RepairStatus.PENDING,
  })
  @IsEnum(RepairStatus)
  status: RepairStatus;

  @ApiProperty({ description: 'Prix de base' })
  @Column('decimal', { precision: 8, scale: 2 })
  @IsNumber()
  base_price: number;

  @ApiProperty({ description: 'Coût supplémentaire' })
  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  @IsNumber()
  additional_cost: number;

  @ApiProperty({ description: 'Coût total' })
  @Column('decimal', { precision: 8, scale: 2 })
  @IsNumber()
  total_cost: number;

  @ApiProperty({ description: 'Date planifiée' })
  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  scheduled_date?: Date;

  @ApiProperty({ description: 'Créneau horaire' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  scheduled_time_slot?: string;

  @ApiProperty({ description: 'Notes du technicien' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  technician_notes?: string;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.repair_requests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => RepairRequestHistory, history => history.repair_request)
  history: RepairRequestHistory[];

  @OneToMany(() => Intervention, intervention => intervention.repair_request)
  interventions: Intervention[];
}

@Entity('repair_request_history')
export class RepairRequestHistory {
  @ApiProperty({ description: 'Identifiant unique de l\'historique' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la demande de réparation' })
  @Column()
  @IsNumber()
  repair_request_id: number;

  @ApiProperty({ description: 'Statut' })
  @Column()
  @IsString()
  status: string;

  @ApiProperty({ description: 'Date de l\'historique' })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({ description: 'Commentaire' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  commentaire?: string;

  @ApiProperty({ description: 'Technicien' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  technicien?: string;

  // Relations
  @ManyToOne(() => RepairRequest, repairRequest => repairRequest.history)
  @JoinColumn({ name: 'repair_request_id' })
  repair_request: RepairRequest;
}

@Entity('interventions')
export class Intervention {
  @ApiProperty({ description: 'Identifiant unique de l\'intervention' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la demande de réparation' })
  @Column()
  @IsNumber()
  repair_request_id: number;

  @ApiProperty({ description: 'Date de l\'intervention' })
  @Column({ type: 'date' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Heure de début' })
  @Column({ type: 'time', nullable: true })
  @IsOptional()
  start_time?: string;

  @ApiProperty({ description: 'Heure de fin' })
  @Column({ type: 'time', nullable: true })
  @IsOptional()
  end_time?: string;

  @ApiProperty({ description: 'Statut de l\'intervention', enum: InterventionStatus })
  @Column({
    type: 'enum',
    enum: InterventionStatus,
    default: InterventionStatus.SCHEDULED,
  })
  @IsEnum(InterventionStatus)
  status: InterventionStatus;

  @ApiProperty({ description: 'Commentaire' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  commentaire?: string;

  @ApiProperty({ description: 'Prochaine action' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  next_action?: string;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => RepairRequest, repairRequest => repairRequest.interventions)
  @JoinColumn({ name: 'repair_request_id' })
  repair_request: RepairRequest;

  @OneToMany(() => InterventionHistory, history => history.intervention)
  history: InterventionHistory[];
}

@Entity('intervention_history')
export class InterventionHistory {
  @ApiProperty({ description: 'Identifiant unique de l\'historique' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de l\'intervention' })
  @Column()
  @IsNumber()
  intervention_id: number;

  @ApiProperty({ description: 'Statut' })
  @Column()
  @IsString()
  status: string;

  @ApiProperty({ description: 'Date de l\'historique' })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({ description: 'Commentaire' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  commentaire?: string;

  @ApiProperty({ description: 'Prochaine action' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  prochaine_action?: string;

  // Relations
  @ManyToOne(() => Intervention, intervention => intervention.history)
  @JoinColumn({ name: 'intervention_id' })
  intervention: Intervention;
} 