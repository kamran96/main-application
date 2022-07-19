import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.CONTACT_MONGO_URI), ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
