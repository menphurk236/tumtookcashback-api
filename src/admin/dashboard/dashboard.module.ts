import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { CustomerRepository } from '../../repositories/customer.repository';
import { PrismaService } from '../../prisma/prisma.service';
import {TransactionRepository} from "../../repositories/transaction.repository";

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService, CustomerRepository, TransactionRepository],
})
export class DashboardModule {}
