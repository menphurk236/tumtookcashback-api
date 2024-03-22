import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SearchDto } from '../shared/dto/search.dto';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) { }

  async findAllToday(searchDto: SearchDto, gte) {
    return await this.prisma.transaction
      .findMany({
        skip: (searchDto.page - 1) * searchDto.perPage,
        take: +searchDto.perPage,
        where: {
          NOT: [{ flag: 'delete' }],
          createdAt: {
            gte,
          },
        },
        include: {
          user: true,
          customer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then(async (data) => {
        return await Promise.all(
          data.map(async (item, key) => {
            return {
              deposit: item.deposit,
              withdraw: item.withdraw,
              tel: item.customer.tel,
              name: `${item.user.firstName} ${item.user.lastName}`,
              balance: item.balance,
              remark: item.remark,
              createdAt: `${item.createdAt.getDate()}/${item.createdAt.getMonth() + 1}/${item.createdAt.getFullYear()}`,
              key: key + 1,
            };
          }),
        );
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async totalToday(gte) {
    return await this.prisma.transaction
      .count({
        where: {
          NOT: [{ flag: 'delete' }],
          createdAt: {
            gte,
          },
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async create(data) {
    return this.prisma.transaction
      .create({ data })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async searchDataFindAll(search: string) {
    return {
      OR: [
        {
          deposit: !isNaN(+search.trim()) ? +search.trim() : 0,
        },
        {
          withdraw: !isNaN(+search.trim()) ? +search.trim() : 0,
        },
        // {
        //   balance: !isNaN(+search.trim()) ? +search.trim() : 0,
        // },
        {
          customer: {
            tel: {
              contains: search.trim(),
            },
          },
        },
        {
          customer: {
            tel: {
              contains: search.trim(),
            },
          },
        },
      ],
    };
  }

  async findAll(searchDto: SearchDto) {
    const search = [];
    if (searchDto.search) {
      search.push(await this.searchDataFindAll(searchDto.search));
    }
    return await this.prisma.transaction
      .findMany({
        skip: (searchDto.page - 1) * searchDto.perPage,
        take: +searchDto.perPage,
        where: {
          AND: [...(search.length ? search : [])],
          NOT: [{ flag: 'delete' }],
        },
        include: {
          customer: true,
          user: true,
          transactionFile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then(async (data) => {
        return await Promise.all(
          data.map(async (item, key) => {
            return {
              customerId: item.customerId,
              tax: item.customer.tax ? item.customer.tax : 'ลูกค้าทั่วไป',
              tel: item.customer.tel,
              createdAt: `${item.createdAt.getDate()}/${item.createdAt.getMonth() + 1}/${item.createdAt.getFullYear()}`,
              deposit: item.deposit,
              withdraw: item.withdraw,
              balance: item.balance,
              remark: item.remark,
              createdBy: `${item.user.firstName} ${item.user.lastName}`,
              file: item.transactionFile.map((file) => {
                return {
                  path: file.path,
                };
              }),
              key: key + 1,
            };
          }),
        );
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async total(searchDto: SearchDto) {
    const search = [];
    if (searchDto.search) {
      search.push(await this.searchDataFindAll(searchDto.search));
    }
    return await this.prisma.transaction
      .count({
        where: {
          AND: [...(search.length ? search : [])],
          NOT: [{ flag: 'delete' }],
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async findById(id: number) {
    return this.prisma.transaction
      .findFirst({
        where: { id },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async update(id, data: Prisma.TransactionUncheckedUpdateInput) {
    return this.prisma.transaction
      .update({
        where: { id },
        data,
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async updateFlag(id, flag: string) {
    return this.prisma.transaction
      .update({
        where: { id },
        data: {
          flag,
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async findByCustomerId(customerId: number, searchDto: SearchDto) {
    return await this.prisma.transaction
      .findMany({
        skip: (searchDto.page - 1) * searchDto.perPage,
        take: +searchDto.perPage,
        where: {
          customerId,
          NOT: [{ flag: 'delete' }],
        },
        include: {
          customer: true,
          user: true,
          transactionFile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then(async (data) => {
        return await Promise.all(
          data.map(async (item, key) => {
            return {
              id: item.id,
              tax: item.customer.tax ? item.customer.tax : 'ลูกค้าทั่วไป',
              tel: item.customer.tel ? item.customer.tel : '-',
              createdAt: `${item.createdAt.getDate()}/${item.createdAt.getMonth() + 1}/${item.createdAt.getFullYear()}`,
              deposit: item.deposit,
              withdraw: item.withdraw,
              balance: item.balance,
              remark: item.remark,
              createdBy: `${item.user.firstName} ${item.user.lastName}`,
              file: item.transactionFile.map((file) => {
                return {
                  path: file.path,
                };
              }),
              // file: item.transactionFile ? item.transactionFile.path : null,
              key: key + 1,
            };
          }),
        );
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async totalCustomerId(customerId: number) {
    return await this.prisma.transaction
      .count({
        where: {
          customerId,
          NOT: [{ flag: 'delete' }],
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async findOneOrderBy(id, orderBy) {
    return this.prisma.transaction
      .findFirst({
        where: {
          customerId: id,
          NOT: [{ flag: 'delete' }],
        },
        include: {
          user: true,
          customer: true,
        },
        orderBy,
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }
}
