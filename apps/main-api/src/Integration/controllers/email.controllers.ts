import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { EmailService } from '../services/email.service';

@Controller('integrate-email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/gmail')
  async gmailConnect() {
    const gmail = await this.emailService.GmailConnect();

    if (gmail) {
      return {
        message: 'Successfull',
        result: gmail,
        status: true,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify-gmail')
  async verifyGmail(@Body() body, @Req() req: Request) {
    const gmail = await this.emailService.VerifyGmail(body.code, req.user);

    if (gmail) {
      return {
        message: 'Successfull',
        result: gmail,
        status: true,
      };
    }
  }
}
