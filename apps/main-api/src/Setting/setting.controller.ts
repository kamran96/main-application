import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SettingDto } from '../dto/setting.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Req() req: Request) {
    try {
      const setting = await this.settingService.ListStorage(req.user);

      if (setting) {
        return {
          message: 'Setting fetched successfull',
          result: setting,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSetting(@Body() settingDto: SettingDto, @Req() req: Request) {
    try {
      const setting = await this.settingService.CreateStorage(
        settingDto,
        req.user
      );

      if (setting) {
        return {
          message: 'Setting created Successfully',
          result: setting,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
