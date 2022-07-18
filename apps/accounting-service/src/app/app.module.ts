import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
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

let dynamicContent;
let staticContent;
if (process.env['NODE' + '_ENV'] === 'production') {
  // read from a file

  const pathToDynamicContent = path.join(
    __dirname,
    '../../../vault/secrets/db-creds'
  );
  const pathToStaticContent = path.join(
    __dirname,
    '../../../vault/secrets/creds'
  );
  const dynamicContentFromVault = fs.readFileSync(
    path.join(pathToDynamicContent),
    {
      encoding: 'utf8',
    }
  );
  const staticContentFromVault = fs.readFileSync(
    path.join(pathToStaticContent),
    {
      encoding: 'utf8',
    }
  );

  // dynamic Content
  const dynamicContentWithoutLineBreaks = dynamicContentFromVault.replace(
    /[\r\n]/gm,
    ''
  );
  const dynamicContentObj = `{${dynamicContentWithoutLineBreaks}}`;
  dynamicContent = JSON.parse(dynamicContentObj);

  // static Content
  const staticContentWithoutLineBreaks = staticContentFromVault.replace(
    /[\r\n]/gm,
    ''
  );
  const staticContentObj = `{${staticContentWithoutLineBreaks}}`;
  staticContent = JSON.parse(staticContentObj);
}

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
            staticContent !== undefined
              ? staticContent.DB_HOST
              : configService.get('DB_HOST', process.env.DB_HOST),
          port:
            staticContent !== undefined
              ? staticContent.DB_PORT
              : configService.get<unknown>('DB_PORT', process.env.DB_PORT),
          username:
            dynamicContent !== undefined
              ? dynamicContent.DB_USER
              : configService.get('DB_USER', process.env.DB_USER),
          password: dynamicContent
            ? dynamicContent.DB_PASSWORD
            : configService.get('DB_PASSWORD', process.env.DB_PASSWORD),
          database: staticContent
            ? staticContent.ACC_DB_NAME
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
