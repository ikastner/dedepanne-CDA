import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairsController } from './repairs.controller';
import { RepairsService } from './repairs.service';
import { 
  RepairRequest, 
  RepairRequestHistory, 
  Intervention, 
  InterventionHistory 
} from '../../database/entities/repair.entity';
import { User } from '../users/entities/user.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RepairRequest,
      RepairRequestHistory,
      Intervention,
      InterventionHistory,
      User,
    ]),
    LogsModule,
  ],
  controllers: [RepairsController],
  providers: [RepairsService],
  exports: [RepairsService],
})
export class RepairsModule {} 