import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
