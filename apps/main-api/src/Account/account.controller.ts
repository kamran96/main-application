import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountIds } from 'aws-sdk/clients/servicecatalog';
import { Request } from 'express';
import { AccountDto } from '../dto/account.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(
    @Req() req: Request,
    @Query() { take, page_no, sort, query, purpose }
  ) {
    try {
      const account = await this.accountService.ListAccounts(
        req.user,
        take,
        page_no,
        sort,
        query,
        purpose
      );

      if (account) {
        return {
          message: 'Account Fetched successfull',
          result: account.item,
          pagination: account.pagination,
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
  @Get('/secondary-accounts')
  async secondaryAccounts(@Req() req: Request) {
    try {
      const secondaryAccounts = await this.accountService.SecondaryAccountName(
        req.user
      );

      if (secondaryAccounts) {
        return {
          message: 'Account fetched successfull',
          result: secondaryAccounts,
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
  async create(@Req() req: Request, @Body() accountDto: AccountDto) {
    try {
      const account = await this.accountService.CreateOrUpdateAccount(
        accountDto,
        req.user
      );

      if (account) {
        return {
          message: 'Account created successfull',
          result: account,
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
  @Get(':id')
  async view(@Param() params, @Req() req) {
    try {
      const account = await this.accountService.FindAccountById(
        params,
        req.user
      );

      if (account) {
        return {
          message: 'Account fetched successfull',
          result: account[0],
        };
      }
      throw new HttpException('Failed to get Account', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async remove(@Body() accountDto: AccountIds) {
    try {
      const account = await this.accountService.DeleteAccount(accountDto);

      if (account) {
        return {
          message: 'Resource modified successfully.',
          status: 1,
        };
      }

      throw new HttpException('Failed to get Accounts', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
