import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionFileRepository {
  constructor(private prisma: PrismaService) {}

  async findByTransactionId(id: number) {
    return this.prisma.transactionFile.findFirst({
      where: { transactionId: id },
    }).catch(async (e: Prisma.PrismaClientKnownRequestError) => {
      throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
    });
  }

  async update(id: number, data: Prisma.TransactionFileUncheckedUpdateInput) {
    return this.prisma.transactionFile.update({
      where: { id },
      data,
    }).catch(async (e: Prisma.PrismaClientKnownRequestError) => {
      console.log(e)
      throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
    });
  }
}
