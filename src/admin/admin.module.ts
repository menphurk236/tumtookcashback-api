import { Module } from '@nestjs/common';
import {CustomerModule} from "./customer/customer.module";
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
      CustomerModule,
      UserModule,
      DashboardModule,
      AuthModule,
      TransactionsModule
  ],
})
export class AdminModule {}
