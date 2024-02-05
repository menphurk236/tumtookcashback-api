import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerRepository } from '../../repositories/customer.repository';
import {TransactionRepository} from "../../repositories/transaction.repository";

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService, CustomerRepository, TransactionRepository],
})
export class CustomerModule {}
