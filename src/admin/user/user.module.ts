import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService,UserRepository]
})
export class UserModule {}
