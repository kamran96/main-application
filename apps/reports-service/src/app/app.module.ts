import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.model';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.REPORT_MONGO_URI), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
