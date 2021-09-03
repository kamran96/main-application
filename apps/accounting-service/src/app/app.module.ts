import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
// import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'postgres',
          // host: configService.get('AC_DB_HOST', process.env.AC_DB_HOST),
          // port: configService.get<any>('AC_DB_PORT', process.env.AC_DB_PORT),
          // username: configService.get('AC_DB_USER', process.env.AC_DB_USER),
          // password: configService.get(
          //   'AC_DB_PASSWORD',
          //   process.env.AC_DB_PASSWORD
          // ),
          // database: configService.get('AC_DB_NAME', process.env.AC_DB_NAME),
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'asdf',
          database: 'accounts',
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          ssl: { rejectUnauthorized: false },
        } as TypeOrmModuleOptions),
    }),
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
