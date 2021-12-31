import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import * as dotenv from 'dotenv';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialModule } from './financial/financial.module';
import { InventoryModule } from './inventory/inventory.module';
dotenv.config();

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) =>
    //     ({
    //       type: 'postgres',
    //       host: configService.get('REP_DB_HOST', process.env.REP_DB_HOST),
    //       port: configService.get<unknown>(
    //         'REP_DB_PORT',
    //         process.env.REP_DB_PORT
    //       ),
    //       username: configService.get('REP_DB_USER', process.env.REP_DB_USER),
    //       password: configService.get(
    //         'REP_DB_PASSWORD',
    //         process.env.REP_DB_PASSWORD
    //       ),
    //       database: configService.get('REP_DB_NAME', process.env.REP_DB_NAME),
    //       entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
    //       // ssl: { rejectUnauthorized: false },
    //     } as TypeOrmModuleOptions),
    // }),
    // ClientsModule.register([
    //   {
    //     name: 'EMAIL_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://localhost:5672'],
    //       queue: 'email_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    // ]),
    // RabbitMQModule.forRoot(RabbitMQModule, {
    //   exchanges: [
    //     {
    // name: 'contact-created',
    // type: 'topic',
    // },
    // ],
    // uri: 'amqp://127.0.0.1:15672',
    // connectionInitOptions: { wait: false },
    // }),
    // InventoryModule,
    // FinancialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
