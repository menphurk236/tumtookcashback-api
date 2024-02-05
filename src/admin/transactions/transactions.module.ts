import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerRepository } from '../../repositories/customer.repository';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { TransactionFileRepository } from '../../repositories/transaction-file.repository';
import { GenerateImageService } from '../../shared/services/generate-image.service';
import { GeneratePdfService } from '../../shared/services/generate-pdf.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PrismaService,
    CustomerRepository,
    TransactionFileRepository,
    TransactionRepository,
    GenerateImageService,
    GeneratePdfService,
  ],
})
export class TransactionsModule {}
