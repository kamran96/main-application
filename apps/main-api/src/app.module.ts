import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getMetadataArgsStorage } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachmentModule } from '../src/Attachment/Attachment.module';
import { AuthModule } from '../src/Auth/auth.module';
import { BranchModule } from '../src/Branch/branch.module';
import { ContactModule } from '../src/Contact/contact.module';
import { ItemModule } from '../src/Item/modules/item.module';
import { OrganizationModule } from '../src/Organization/organization.module';
import { PriceModule } from '../src/Item/modules/price.module';
import { SettingModule } from '../src/Setting/setting.module';
import { UserModule } from '../src/User/user.module';
import { TransactionModule } from '../src/Transaction/transaction.module';
import { AccountModule } from '../src/Account/account.module';
import { InvoiceModule } from '../src/Invoice/invoice.module';
import { RbacModule } from '../src/Rbac/rbac.module';
import { ReportModule } from '../src/Report/report.module';
import { XeroModule } from '../src/Integration/modules/xero.module';
import { QuickbooksModule } from '../src/Integration/modules/quickbooks.module';
import { EmailModule } from '../src/Integration/modules/email.model';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsController } from './accounts/accounts.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'postgres',
          host: configService.get('DB_HOST', process.env.DB_HOST),
          port: configService.get<any>('DB_PORT', process.env.DB_PORT),
          username: configService.get('DB_USER', process.env.DB_USER),
          password: configService.get('DB_PASSWORD', process.env.DB_PASSWORD),
          database: configService.get('DB_NAME', process.env.DB_NAME),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    AuthModule,
    UserModule,
    AccountModule,
    InvoiceModule,
    TransactionModule,
    ItemModule,
    ContactModule,
    PriceModule,
    OrganizationModule,
    BranchModule,
    SettingModule,
    AttachmentModule,
    RbacModule,
    ReportModule,
    XeroModule,
    QuickbooksModule,
    EmailModule,
  ],
  controllers: [AppController, AccountsController],
  providers: [AppService],
})
export class AppModule {}
