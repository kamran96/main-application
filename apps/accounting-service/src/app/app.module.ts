import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionModule } from './transaction/transaction.module';
import { BankModule } from './bank/bank.module';
import { ReportModule } from './report/report.module';
dotenv.config();

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
          port: configService.get<unknown>('DB_PORT', process.env.DB_PORT),
          username: configService.get('DB_USER', process.env.DB_USER),
          password: configService.get('DB_PASSWORD', process.env.DB_PASSWORD),
          database: configService.get('ACC_DB_NAME', process.env.ACC_DB_NAME),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          ...(process.env.NODE_ENV === 'development'
            ? {}
            : { ssl: { rejectUnauthorized: false } }),
        } as TypeOrmModuleOptions),
    }),
    AccountsModule,
    TransactionModule,
    BankModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
