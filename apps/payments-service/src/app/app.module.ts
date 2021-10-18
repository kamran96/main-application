import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'postgres',
          host: configService.get(
            'PAYMENT_DB_HOST',
            process.env.PAYMENT_DB_HOST
          ),
          port: configService.get<any>(
            'PAYMENT_DB_PORT',
            process.env.PAYMENT_DB_PORT
          ),
          username: configService.get(
            'PAYMENT_DB_USER',
            process.env.PAYMENT_DB_USER
          ),
          password: configService.get(
            'PAYMENT_DB_PASSWORD',
            process.env.PAYMENT_DB_PASSWORD
          ),
          database: configService.get(
            'PAYMENT_DB_NAME',
            process.env.PAYMENT_DB_NAME
          ),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
