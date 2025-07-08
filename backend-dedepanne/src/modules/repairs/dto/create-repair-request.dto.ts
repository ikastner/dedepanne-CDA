import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate, IsEnum } from 'class-validator';
import { RepairStatus } from '../../../database/entities/repair.entity';

export class CreateRepairRequestDto {
  @ApiProperty({ description: 'Type d\'appareil' })
  @IsNumber()
  appliance_type_id: number;

  @ApiProperty({ description: 'Marque de l\'appareil', required: false })
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @ApiProperty({ description: 'Modèle de l\'appareil', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Description du problème' })
  @IsString()
  issue_description: string;

  @ApiProperty({ description: 'Prix de base' })
  @IsNumber()
  base_price: number;

  @ApiProperty({ description: 'Coût supplémentaire', required: false })
  @IsOptional()
  @IsNumber()
  additional_cost?: number;

  @ApiProperty({ description: 'Date planifiée', required: false })
  @IsOptional()
  @IsDate()
  scheduled_date?: Date;

  @ApiProperty({ description: 'Créneau horaire', required: false })
  @IsOptional()
  @IsString()
  scheduled_time_slot?: string;

  @ApiProperty({ description: 'Notes du technicien', required: false })
  @IsOptional()
  @IsString()
  technician_notes?: string;
} 