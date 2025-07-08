import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { InterventionStatus } from '../../../database/entities/repair.entity';

export class CreateInterventionDto {
  @ApiProperty({ description: 'Date de l\'intervention' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Heure de début', required: false })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({ description: 'Heure de fin', required: false })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiProperty({ description: 'Statut de l\'intervention', enum: InterventionStatus, required: false })
  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;

  @ApiProperty({ description: 'Commentaire', required: false })
  @IsOptional()
  @IsString()
  commentaire?: string;

  @ApiProperty({ description: 'Prochaine action', required: false })
  @IsOptional()
  @IsString()
  next_action?: string;
} 