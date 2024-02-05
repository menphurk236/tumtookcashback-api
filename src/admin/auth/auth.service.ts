import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../../repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async login(body: LoginDto): Promise<object> {
    const user = await this.userRepository.findByUsername(body.username);

    if (!user) {
      throw new UnauthorizedException(
        `ไม่พบบัญชีในระบบ`,
      );
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key];
    }
    return user;
  }
}
