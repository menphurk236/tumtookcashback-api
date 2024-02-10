import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomersDto } from './dto/create-customers.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SearchDto } from '../../shared/dto/search.dto';
import { CustomerRepository } from '../../repositories/customer.repository';
import { Prisma } from '@prisma/client';
import { TransactionRepository } from '../../repositories/transaction.repository';

@Injectable()
export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private transactionRepository: TransactionRepository,
  ) { }
  async create(body: CreateCustomersDto, user: any): Promise<object> {
    const data: Prisma.CustomerUncheckedCreateInput = {
      company: body.company,
      name: body.name,
      tax: body.tax,
      tel: body.tel,
      createdBy: user.id,
    };
    if (body.tel !== '-') {
      const check = await this.customerRepository.findByPhone(body.tel)
      if (check) {
        throw new BadRequestException('เบอร์โทรศัพท์นี้มีในระบบแล้ว')
      }
    }
    const customer = await this.customerRepository.create(data);
    return {
      message: 'บันทึกสำเร็จ',
      id: customer.id,
    };
  }

  async findAll(searchDto: SearchDto): Promise<object> {
    const items = await this.customerRepository.findAll(searchDto);
    const total = await this.customerRepository.total(searchDto);
    const page = +searchDto.page;
    const perPage = +searchDto.perPage;
    return {
      items,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: number): Promise<object> {
    console.log('id', id);
    const item = await this.customerRepository.findById(id);
    if (!item) {
      throw new BadRequestException('ไม่พบข้อมูลลูกค้า')
    }
    item.createdAt = undefined;
    return {
      ...item,
    };
  }

  async update(id: number, body: UpdateCustomerDto): Promise<object> {
    const data: Prisma.CustomerUpdateInput = {
      company: body.company,
      name: body.name,
      tax: body.tax,
      tel: body.tel,
    };
    const item = await this.customerRepository.findById(id);
    if (!item) {
      throw new BadRequestException('ไม่พบข้อมูลลูกค้า')
    }

    // if (body.tel !== '-') {
    //   if (item.tel !== body.tel) {
    //     const check = await this.customerRepository.findByPhone(body.tel)
    //     if (check) {
    //       throw new BadRequestException('เบอร์โทรศัพท์นี้มีในระบบแล้ว')
    //     }
    //   }
    // }
    await this.customerRepository.update(id, data);
    return {
      message: 'แก้ไขสำเร็จ',
    };
  }

  async remove(id: number) {
    await this.customerRepository.updateFlag(id, 'delete');
    return {
      message: 'ลบข้อมูลสำเร็จ',
    };
  }
}
