import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ReconditionedProduct } from './product.entity';

@Entity('brands')
export class ApplianceBrand {
  @ApiProperty({ description: 'Identifiant unique de la marque' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nom de la marque' })
  @Column()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description de la marque' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Pays d\'origine' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Site web' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => ReconditionedProduct, product => product.brand)
  products: ReconditionedProduct[];
} 