import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RepairsModule } from './modules/repairs/repairs.module';
import { ProductsModule } from './modules/products/products.module';
import { DonationsModule } from './modules/donations/donations.module';
import { LogsModule } from './modules/logs/logs.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Base de données
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    
    // Modules métier
    AuthModule,
    UsersModule,
    RepairsModule,
    ProductsModule,
    DonationsModule,
    LogsModule,
  ],
})
export class AppModule {} 