import { Controller, Get, Res } from '@nestjs/common';

import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck(@Res() res: Response) {
    res.send('OKKKKK');
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
