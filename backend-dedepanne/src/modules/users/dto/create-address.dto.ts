import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Ligne d\'adresse' })
  @IsString()
  address_line1: string;

  @ApiProperty({ description: 'Ville' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Code postal' })
  @IsString()
  postal_code: string;

  @ApiProperty({ description: 'Département' })
  @IsString()
  department: string;

  @ApiProperty({ description: 'Adresse principale', required: false })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
} 