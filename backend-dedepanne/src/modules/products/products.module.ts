import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { PublicProductsController } from './public-products.controller';
import { ProductsService } from './products.service';
import { ReconditionedProduct, Order, OrderItem, OrderHistory } from '../../database/entities/product.entity';
import { ApplianceType } from '../../database/entities/appliance-type.entity';
import { ApplianceBrand } from '../../database/entities/appliance-brand.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReconditionedProduct, Order, OrderItem, OrderHistory, ApplianceType, ApplianceBrand]),
    LogsModule,
  ],
  controllers: [ProductsController, PublicProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {} 