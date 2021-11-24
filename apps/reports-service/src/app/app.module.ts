import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialModule } from './financial/financial.module';
import { InventoryModule } from './inventory/inventory.module';
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
          host: configService.get('REP_DB_HOST', process.env.REP_DB_HOST),
          port: configService.get<unknown>(
            'REP_DB_PORT',
            process.env.REP_DB_PORT
          ),
          username: configService.get('REP_DB_USER', process.env.REP_DB_USER),
          password: configService.get(
            'REP_DB_PASSWORD',
            process.env.REP_DB_PASSWORD
          ),
          database: configService.get('REP_DB_NAME', process.env.REP_DB_NAME),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          // ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
    InventoryModule,
    FinancialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
