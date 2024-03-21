import { BadRequestException, Injectable, Param, Res } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Prisma } from '@prisma/client';
import { CustomerRepository } from '../../repositories/customer.repository';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { SearchDto } from '../../shared/dto/search.dto';
import { TransactionFileRepository } from '../../repositories/transaction-file.repository';
import { GenerateImageService } from '../../shared/services/generate-image.service';
import { GeneratePdfService } from '../../shared/services/generate-pdf.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private transactionRepository: TransactionRepository,
    private transactionFileRepository: TransactionFileRepository,
    private readonly generateImageService: GenerateImageService,
    private readonly generatePdfService: GeneratePdfService,
  ) { }
  async create(
    body: CreateTransactionDto,
    files: any,
    user: any,
  ): Promise<object> {
    const customer = await this.customerRepository.findById(+body.customerId);

    const balance = customer.balance + (+body.deposit - +body.withdraw);
    if (balance < 0) {
      throw new BadRequestException('ยอดคงเหลือไม่พอ');
    }

    const data: Prisma.TransactionUncheckedCreateInput = {
      customerId: +body.customerId,
      createdBy: user.id,
      balance: balance,
      cashBack: customer.balance,
      remark: body.remark,
      withdraw: +body.withdraw,
      deposit: +body.deposit,
      createdAt: new Date(),
    };

    if (files.length > 0) {
      data.transactionFile = {
        createMany: {
          data: files.map((item) => {
            return {
              name: item.filename,
              path: `/uploads/transaction/${item.filename}`,
            };
          }),
        },
      };
    }

    await this.transactionRepository.create(data);
    await this.customerRepository.updateBalanceById(+body.customerId, balance);

    return {
      message: 'บันทึกสำเร็จ',
    };
  }

  async findAll(searchDto: SearchDto): Promise<object> {
    const items = await this.transactionRepository.findAll(searchDto);
    const total = await this.transactionRepository.total(searchDto);
    const page = +searchDto.page;
    const perPage = +searchDto.perPage;
    return {
      items,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: number, searchDto: SearchDto): Promise<object> {
    const customer = await this.customerRepository.findById(id);
    const items = await this.transactionRepository.findByCustomerId(
      id,
      searchDto,
    );
    const total = await this.transactionRepository.totalCustomerId(id);
    customer.balance = undefined;
    return {
      customer,
      transactions: {
        items,
        page: +searchDto.page,
        perPage: +searchDto.perPage,
        total,
      },
    };
  }

  async update(
    id: number,
    body: UpdateTransactionDto,
    files: any,
    user: any,
  ): Promise<object> {
    const data: Prisma.TransactionUncheckedUpdateInput = {
      createdBy: user.id,
      remark: body.remark,
    };
    if (files.length > 0) {
      data.transactionFile = {
        createMany: {
          data: files.map((item) => {
            return {
              name: item.filename,
              path: `/uploads/transaction/${item.filename}`,
            };
          }),
        },
      };
    }
    await this.transactionRepository.update(id, data);

    return { message: 'แก้ไขสำเร็จ' };
  }

  async updateFile(id: number, files: any, user: any): Promise<object> {
    const data: Prisma.TransactionUncheckedUpdateInput = {
      createdBy: user.id,
    };
    if (files.length > 0) {
      data.transactionFile = {
        createMany: {
          data: files.map((item) => {
            return {
              name: item.filename,
              path: `/uploads/transaction/${item.filename}`,
            };
          }),
        },
      };
    }
    await this.transactionRepository.update(id, data);
    return { message: 'แก้ไขสำเร็จ' };
  }

  async remove(id: number): Promise<object> {
    const transaction = await this.transactionRepository.updateFlag(
      id,
      'delete',
    );
    const customer = await this.customerRepository.findById(
      transaction.customerId,
    );
    const balance =
      customer.balance + (+transaction.withdraw - +transaction.deposit);

    await this.customerRepository.updateBalanceById(
      transaction.customerId,
      balance,
    );
    return {
      message: 'ลบข้อมูลสำเร็จ',
    };
  }

  async generateSlip(id) {
    const transaction = await this.transactionRepository
      .findOneOrderBy(id, {
        createdAt: 'desc',
      })
      .then((item) => {
        return {
          id: item.id,
          createdAt: item.createdAt,
          deposit: item.deposit,
          withdraw: item.withdraw,
          admin: item.user
            ? `${item.user.firstName} ${item.user.lastName}`
            : null,
          name: item.customer.name,
          company: item.customer.company,
          tax: item.customer.tax,
          tel: item.customer.tel,
          remark: item.remark,
          // price: item.price,
          balance: item.balance,
          cashBack: item.cashBack,
          slip: item.slip,
        };
      })
      .catch((e) => {
        console.log(e);
        throw new BadRequestException('ไม่พบข้อมูลยอดคงเหลือล่าสุด');
      });
    if (transaction.slip) {
      return {
        slip: transaction.slip,
      };
    }
    const dataUpdate: Prisma.TransactionUncheckedUpdateInput = {
      slip: await this.generateImageService.generate(transaction),
    };
    const data = await this.transactionRepository.update(
      transaction.id,
      dataUpdate,
    );
    return { slip: data.slip };
  }

  async generatePdf(searchDto: SearchDto, id: number) {
    const items = await this.transactionRepository.findByCustomerId(
      id,
      searchDto,
    );
    const customer = await this.customerRepository.findById(id);
    await this.generatePdfService.generate(items, customer);
  }
}
