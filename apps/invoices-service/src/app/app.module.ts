import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
require('dotenv').config();
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './invoice/inovice.module';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'postgres',
          host: configService.get('INV_DB_HOST', process.env.INV_DB_HOST),
          port: configService.get<any>('INV_DB_PORT', process.env.INV_DB_PORT),
          username: configService.get('INV_DB_USER', process.env.INV_DB_USER),
          password: configService.get(
            'INV_DB_PASSWORD',
            process.env.INV_DB_PASSWORD
          ),
          database: configService.get('INV_DB_NAME', process.env.INV_DB_NAME),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, Authenticate],
})
export class AppModule {}
