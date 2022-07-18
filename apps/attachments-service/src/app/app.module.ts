import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttachmentModule } from '../attachment/attachment.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), AttachmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
