import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ReconditionedProduct } from './product.entity';

@Entity('appliance_types')
export class ApplianceType {
  @ApiProperty({ description: 'Identifiant unique du type d\'appareil' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nom du type d\'appareil' })
  @Column()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description du type d\'appareil' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => ReconditionedProduct, product => product.applianceType)
  products: ReconditionedProduct[];
} 