import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './invoice/inovice.module';
import { Authenticate } from '@invyce/auth-middleware';
import { BillModule } from './bill/bill.module';
import { CreditNoteModule } from './credit-note/credit-note.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
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
          database: configService.get('INV_DB_NAME', process.env.INV_DB_NAME),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          // ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
    InvoiceModule,
    BillModule,
    CreditNoteModule,
    PurchaseOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, Authenticate],
})
export class AppModule {}
