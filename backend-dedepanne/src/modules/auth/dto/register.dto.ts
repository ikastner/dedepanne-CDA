import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';
import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Email de l\'utilisateur' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mot de passe (minimum 6 caractères)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Prénom de l\'utilisateur' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Nom de l\'utilisateur' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Numéro de téléphone', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Rôle de l\'utilisateur', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 