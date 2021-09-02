import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
require('dotenv').config();
import { AppController } from './app.controller';
import { AppService } from './app.service';
console.log(process.env.INVOICE_DB_USER);

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
            'INVOICE_DB_HOST',
            process.env.INVOICE_DB_HOST
          ),
          port: configService.get<any>(
            'INVOICE_DB_PORT',
            process.env.INVOICE_DB_PORT
          ),
          username: configService.get(
            'INVOICE_DB_USER',
            process.env.INVOICE_DB_USER
          ),
          password: configService.get(
            'INVOICE_DB_PASSWORD',
            process.env.INVOICE_DB_PASSWORD
          ),
          database: configService.get(
            'INVOICE_DB_NAME',
            process.env.INVOICE_DB_NAME
          ),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
