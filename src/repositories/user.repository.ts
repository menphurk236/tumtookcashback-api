import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SearchDto } from '../shared/dto/search.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user
      .create({ data })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.log(e);
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }

  async searchDataFindAll(search: string) {
    return {
      OR: [
        {
          firstName: {
            contains: search.trim(),
          },
        },
        {
          lastName: {
            contains: search.trim(),
          },
        },
        {
          username: {
            contains: search.trim(),
          },
        },
      ],
    };
  }
  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username: username,
        NOT: [{ flag: 'delete' }],
      },
    });
  }
  async findAll(searchDto: SearchDto) {
    const search = [];
    if (searchDto.search) {
      search.push(await this.searchDataFindAll(searchDto.search));
    }
    return await this.prisma.user
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
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          tel: true,
          role: true,
        },
      })
      .then(async (data) => {
        return await Promise.all(
          data.map(async (item, key) => {
            return {
              ...item,
              roleText:
                item.role === 'participant'
                  ? 'ผู้มีส่วนร่วม'
                  : item.role === 'admin'
                  ? 'แอดมิน'
                  : 'ผู้ดูแล',
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
    return await this.prisma.user
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
    return await this.prisma.user
      .findFirst({
        where: {
          id: id,
          NOT: [{ flag: 'delete' }],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          tel: true,
          role: true,
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }
  async update(id: number, data: Prisma.UserUpdateInput) {
    return await this.prisma.user
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
  async removeById(id: number) {
    return await this.prisma.user
      .update({
        where: {
          id,
        },
        data: {
          flag: 'delete',
        },
      })
      .catch(async (e: Prisma.PrismaClientKnownRequestError) => {
        throw new InternalServerErrorException('เซิฟเวอร์มีปัญหา');
      });
  }
}
