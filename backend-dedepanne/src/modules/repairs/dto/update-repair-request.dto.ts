import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateRepairRequestDto } from './create-repair-request.dto';
import { RepairStatus } from '../../../database/entities/repair.entity';

export class UpdateRepairRequestDto extends PartialType(CreateRepairRequestDto) {
  @IsOptional()
  @IsEnum(RepairStatus)
  status?: RepairStatus;

  @IsOptional()
  technician_notes?: string;
} 