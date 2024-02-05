import {BadRequestException, Injectable} from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { SearchDto } from 'src/shared/dto/search.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async create(body: CreateUserDto): Promise<object> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(body.password, salt);
    const data: Prisma.UserCreateInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      tel: body.tel,
      role: body.role,
      password: hashPassword,
    };
    await this.userRepository.create(data);
    return {
      message: 'บันทึกสำเร็จ',
    };
  }

  async findAll(searchDto: SearchDto): Promise<object> {
    const items = await this.userRepository.findAll(searchDto);
    const total = await this.userRepository.total(searchDto);
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
    const item = await this.userRepository.findById(id);
    return {
      ...item,
    };
  }

  async update(id: number, body: UpdateUserDto): Promise<object> {
    const data: Prisma.UserUpdateInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      tel: body.tel,
    };
    if (body.password) {
      if (body.password !== body.confirmPassword){
        throw new BadRequestException('ยืนยันรหัสไม่ตรงกัน')
      }
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(body.password, salt);
    }
    await this.userRepository.update(id, data);
    return {
      message: 'แก้ไขสำเร็จ',
    };
  }

  async remove(id: number): Promise<object> {
    await this.userRepository.removeById(id);
    return {
      message: 'ลบข้อมูลสำเร็จ',
    };
  }
}
