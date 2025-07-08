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
import { IsString, IsNumber, IsOptional, IsDate, IsEnum, IsBoolean } from 'class-validator';
import { User } from '../../modules/users/entities/user.entity';
import { ApplianceType } from './appliance-type.entity';
import { ApplianceBrand } from './appliance-brand.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum ConditionRating {
  EXCELLENT = 'excellent',
  VERY_GOOD = 'very_good',
  GOOD = 'good',
  FAIR = 'fair',
}

@Entity('reconditioned_products')
export class ReconditionedProduct {
  @ApiProperty({ description: 'Identifiant unique du produit' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nom du produit' })
  @Column()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type d\'appareil' })
  @Column()
  @IsNumber()
  appliance_type_id: number;

  @ApiProperty({ description: 'Marque' })
  @Column()
  @IsNumber()
  brand_id: number;

  @ApiProperty({ description: 'Modèle' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Prix actuel' })
  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Prix d\'origine' })
  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  original_price: number;

  @ApiProperty({ description: 'Pourcentage de réduction' })
  @Column('decimal', { precision: 5, scale: 2 })
  @IsNumber()
  savings_percentage: number;

  @ApiProperty({ description: 'État du produit', enum: ConditionRating })
  @Column({
    type: 'enum',
    enum: ConditionRating,
  })
  @IsEnum(ConditionRating)
  condition_rating: ConditionRating;

  @ApiProperty({ description: 'Garantie en mois' })
  @Column()
  @IsNumber()
  warranty_months: number;

  @ApiProperty({ description: 'Caractéristiques (JSON)' })
  @Column('jsonb', { nullable: true })
  @IsOptional()
  features?: any;

  @ApiProperty({ description: 'Description' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL de l\'image' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ description: 'Quantité en stock' })
  @Column({ default: 0 })
  @IsNumber()
  stock_quantity: number;

  @ApiProperty({ description: 'Disponibilité' })
  @Column({ default: true })
  @IsBoolean()
  is_available: boolean;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => ApplianceType, applianceType => applianceType.products)
  @JoinColumn({ name: 'appliance_type_id' })
  applianceType: ApplianceType;

  @ManyToOne(() => ApplianceBrand, brand => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: ApplianceBrand;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  order_items: OrderItem[];
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'Identifiant unique de la commande' })
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

  @ApiProperty({ description: 'Statut de la commande', enum: OrderStatus })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ description: 'Montant total' })
  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  total_amount: number;

  @ApiProperty({ description: 'Date de livraison' })
  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  delivery_date?: Date;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];

  @OneToMany(() => OrderHistory, history => history.order)
  history: OrderHistory[];
}

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'Identifiant unique de l\'article' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la commande' })
  @Column()
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'ID du produit' })
  @Column()
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'Nom de l\'article' })
  @Column()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Prix de l\'article' })
  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ReconditionedProduct, product => product.order_items)
  @JoinColumn({ name: 'product_id' })
  product: ReconditionedProduct;
}

@Entity('order_history')
export class OrderHistory {
  @ApiProperty({ description: 'Identifiant unique de l\'historique' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la commande' })
  @Column()
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'Étape' })
  @Column()
  @IsString()
  etape: string;

  @ApiProperty({ description: 'Date de l\'historique' })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({ description: 'Transporteur' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  transporteur?: string;

  @ApiProperty({ description: 'Numéro de suivi' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  numero_suivi?: string;

  @ApiProperty({ description: 'Commentaire' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  commentaire?: string;

  // Relations
  @ManyToOne(() => Order, order => order.history)
  @JoinColumn({ name: 'order_id' })
  order: Order;
} 