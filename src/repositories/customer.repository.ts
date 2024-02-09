import { Injectable, InternalServerErrorException, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SearchDto } from '../shared/dto/search.dto';

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.CustomerUncheckedCreateInput) {
    return this.prisma.customer
      .create({ data })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async searchDataFindAll(search: string) {
    return {
      OR: [
        {
          name: {
            contains: search.trim(),
          },
        },
        {
          company: {
            contains: search.trim(),
          },
        },
        {
          tax: {
            contains: search.trim(),
          },
        },
        {
          tel: {
            contains: search.trim(),
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
    return await this.prisma.customer
      .findMany({
        skip: (searchDto.page - 1) * searchDto.perPage,
        take: +searchDto.perPage,
        where: {
          AND: [...(search.length ? search : [])],
          NOT: [{ flag: 'delete' }],
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
              name:
                item.name && item.company
                  ? `${item.name} | ${item.company}`
                  : item.name
                    ? item.name
                    : item.company
                      ? item.company
                      : null,
              tel: item.tel,
              tax: item.tax ? item.tax : 'ลูกค้าทั่วไป',
              balance: item.balance,
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
    return await this.prisma.customer
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
    return await this.prisma.customer
      .findFirst({
        where: {
          id,
          NOT: [{ flag: 'delete' }],
        },
        include: {
          transactions: {
            include: {
              transactionFile: true,
              user: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      })
      .then(async (item) => {
        return {
          id: item.id,
          name: item.name,
          company: item.company,
          tel: item.tel,
          tax: item.tax,
          balance: item.balance,
          createdAt: `${item.createdAt.getDate()}/${item.createdAt.getMonth()}/${item.createdAt.getFullYear()}`,
        };
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }


  async findByPhone(tel: string) {
    return await this.prisma.customer
      .findFirst({
        where: {
          tel,
          NOT: [{ flag: 'delete' }],
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async update(id: number, data: Prisma.CustomerUpdateInput) {
    return await this.prisma.customer
      .update({
        where: {
          id,
        },
        data,
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async updateFlag(id: number, flag: string) {
    return await this.prisma.customer
      .update({
        where: {
          id,
        },
        data: {
          flag,
          transactions: {
            updateMany: {
              where: {
                customerId: id,
              },
              data: {
                flag,
              },
            },
          },
        },
        include: {
          transactions: true,
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async totalBalance() {
    return this.prisma.customer.aggregate({
      where: {
        NOT: [{ flag: 'delete' }],
      },
      _sum: {
        balance: true,
      },
    });
  }

  async totalCustomer() {
    return this.prisma.customer
      .count({
        where: {
          NOT: [{ flag: 'delete' }],
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async updateBalanceById(id: number, balance: number) {
    return this.prisma.customer
      .update({
        where: { id },
        data: { balance },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async searchCustomer(search) {
    return await this.prisma.customer
      .findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  tel: {
                    contains: search.trim(),
                  },
                },
                {
                  tax: {
                    contains: search,
                  },
                },
                {
                  name: {
                    contains: search,
                  },
                },
                {
                  company: {
                    contains: search,
                  },
                },
                {
                  transactions: {
                    some: {
                      OR: [
                        {
                          remark: {
                            equals: search,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
          NOT: [{ flag: 'delete' }],
        },
        include: {
          transactions: {
            where: {
              NOT: [
                {
                  flag: 'delete',
                },
              ],
            },
          },
        },
      })
      .then(async (items) => {
        return await Promise.all(
          items.map(async (item, key) => {
            return {
              name: item?.name,
              company: item?.company,
              tel: item?.tel,
              balance: item?.balance,
              transactions: item?.transactions.map((data, key) => {
                return {
                  remark: data.remark,
                };
              }),
            };
          }),
        );
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }
}
