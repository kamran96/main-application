import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/users'),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
