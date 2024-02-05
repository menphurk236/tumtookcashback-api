import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import {CustomerRepository} from "../../repositories/customer.repository";
import {PrismaService} from "../../prisma/prisma.service";

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService, CustomerRepository],
})
export class CustomerModule {}
