import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { CustomerRepository } from '../../repositories/customer.repository';
import { SearchDto } from '../../shared/dto/search.dto';
import { TransactionRepository } from '../../repositories/transaction.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}
  async findAll(searchDto: SearchDto): Promise<object> {
    const totalBalance = await this.customerRepository.totalBalance();
    const totalCustomer = await this.customerRepository.totalCustomer();
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 1);
    const items = await this.transactionRepository.findAllToday(searchDto,previousDate);
    const total = await this.transactionRepository.totalToday(previousDate);
    const page = +searchDto.page;
    const perPage = +searchDto.perPage;
    return {
      totalBalance:
        totalBalance['_sum']['balance'] == null
          ? (totalBalance['_sum']['balance'] = 0)
          : totalBalance['_sum']['balance'],
      totalCustomer,
      transactionToDay: {
        items,
        total,
        page,
        perPage,
      },
    };
  }
}
