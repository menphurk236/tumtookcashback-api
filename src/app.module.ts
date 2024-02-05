import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';

// Admin Module
import { AdminModule } from './admin/admin.module';
import { AuthModule as AdminAuthModule } from './admin/auth/auth.module';
import { CustomerModule as AdminCustomerModule } from './admin/customer/customer.module';
import { TransactionsModule as AdminTransactionsModule } from './admin/transactions/transactions.module';
import { UserModule as AdminUserModule } from './admin/user/user.module'
import { DashboardModule as AdminDashboardModule } from './admin/dashboard/dashboard.module'
//

// Homepage Module
import { HomepageModule } from './homepage/homepage.module';
import { CustomerModule as HomepageCustomerModule } from './homepage/customer/customer.module';
import { PrismaModule } from './prisma/prisma.module';
//

const Router = RouterModule.register([
  {
    path: 'admin',
    module: AdminModule,
    children: [
      {
        path: '/',
        module: AdminAuthModule,
      },
      {
        path: '/',
        module: AdminDashboardModule,
      },
      {
        path: '/',
        module: AdminCustomerModule,
      },
      {
        path: '/',
        module: AdminTransactionsModule,
      },
      {
        path: '/',
        module: AdminUserModule,
      },
    ],
  },
  {
    path: 'homepage',
    module: HomepageModule,
    children: [
      {
        path: '/',
        module: HomepageCustomerModule,
      },
    ],
  },
]);
@Module({
  imports: [
    Router,
    AdminModule,
    HomepageModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
