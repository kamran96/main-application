import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage, SimpleConsoleLogger } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionModule } from './transaction/transaction.module';
import { BankModule } from './bank/bank.module';
import { ReportModule } from './report/report.module';

dotenv.config();

console.log('okkkk');

let con;
if (process.env['NODE' + '_ENV'] === 'production') {
  // read from a file

  const pathToFile = path.join(__dirname, '../../../vault/secrets/db-creds');
  con = fs.readFileSync(path.join(pathToFile), {
    encoding: 'utf8',
  });
}

console.log(typeof con);
console.log(con, 'con');

const obj = eval(`'{${con}}'`);
console.log(obj, 'obj');
const content = JSON.parse(obj);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'postgres',
          host:
            content !== undefined
              ? content.DB_HOST
              : configService.get('DB_HOST', process.env.DB_HOST),
          port:
            content !== undefined
              ? content.DB_PORT
              : configService.get<unknown>('DB_PORT', process.env.DB_PORT),
          username:
            content !== undefined
              ? content.DB_USER
              : configService.get('DB_USER', process.env.DB_USER),
          password: content
            ? content.DB_PASSWORD
            : configService.get('DB_PASSWORD', process.env.DB_PASSWORD),
          database: content
            ? content.ACC_DB_NAME
            : configService.get('ACC_DB_NAME', process.env.ACC_DB_NAME),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          ssl: { rejectUnauthorized: false },
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
