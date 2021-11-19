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
          host: configService.get('ACC_DB_HOST', process.env.ACC_DB_HOST),
          port: configService.get<unknown>(
            'ACC_DB_PORT',
            process.env.ACC_DB_PORT
          ),
          username: configService.get('ACC_DB_USER', process.env.ACC_DB_USER),
          password: configService.get(
            'ACC_DB_PASSWORD',
            process.env.ACC_DB_PASSWORD
          ),
          database: configService.get('ACC_DB_NAME', process.env.ACC_DB_NAME),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          // ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
    AccountsModule,
    TransactionModule,
    BankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
