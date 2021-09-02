import { Module } from '@nestjs/common';
import { getMetadataArgsStorage } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '../accounts/accounts.module';
import {ConfigModule} from '@nestjs/config'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.AC_HOST,
      port: parseInt(process.env.AC_PORT, 10) ,
      username: process.env.AC_USERNAME,
      password: process.env.AC_PASSWORD,
      database: process.env.AC_DATABASE,
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      // entities: ['../**/*.entity.{ts,js}'],
    }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: ['../../.env'],
    // }),
    AccountsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
