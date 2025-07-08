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

export enum DonationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PICKED_UP = 'picked_up',
  PROCESSED = 'processed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('donations')
export class Donation {
  @ApiProperty({ description: 'Identifiant unique du don' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  @Column()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Code de référence unique' })
  @Column({ unique: true })
  @IsString()
  reference_code: string;

  @ApiProperty({ description: 'Type d\'appareil' })
  @Column()
  @IsNumber()
  appliance_type_id: number;

  @ApiProperty({ description: 'Marque' })
  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @ApiProperty({ description: 'Statut du don', enum: DonationStatus })
  @Column({
    type: 'enum',
    enum: DonationStatus,
    default: DonationStatus.PENDING,
  })
  @IsEnum(DonationStatus)
  status: DonationStatus;

  @ApiProperty({ description: 'Date d\'enlèvement' })
  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  pickup_date?: Date;

  @ApiProperty({ description: 'Adresse d\'enlèvement' })
  @Column('text')
  @IsString()
  address: string;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.donations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DonationHistory, history => history.donation)
  history: DonationHistory[];
}

@Entity('donation_history')
export class DonationHistory {
  @ApiProperty({ description: 'Identifiant unique de l\'historique' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID du don' })
  @Column()
  @IsNumber()
  donation_id: number;

  @ApiProperty({ description: 'Étape' })
  @Column()
  @IsString()
  etape: string;

  @ApiProperty({ description: 'Date de l\'historique' })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({ description: 'Lieu' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  lieu?: string;

  @ApiProperty({ description: 'Commentaire' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  commentaire?: string;

  // Relations
  @ManyToOne(() => Donation, donation => donation.history)
  @JoinColumn({ name: 'donation_id' })
  donation: Donation;
} 