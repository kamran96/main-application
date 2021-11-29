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
import { AccountsService } from './accounts.service';
import {
  AccountCodesDto,
  AccountDto,
  AccountIdsDto,
  ParamsDto,
} from '../dto/account.dto';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import {
  IRequest,
  IPage,
  IAccountWithResponse,
  ISecondaryAccountWithResponse,
  IAccount,
} from '@invyce/interfaces';

@Controller('account')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<IAccountWithResponse> {
    try {
      const account = await this.accountService.ListAccounts(req.user, query);
      if (account) {
        return {
          message: 'Account Fetched successfull',
          status: true,
          pagination: account.pagination,
          result: !account.pagination ? account : account.result,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('type')
  @UseGuards(GlobalAuthGuard)
  async accountWithType(@Query() { type }, @Req() req: IRequest) {
    const account = await this.accountService.AccountWithType(type, req.user);
    if (account) {
      return {
        message: 'Account Fetched successfull',
        status: true,
        result: account,
      };
    }
  }

  @Get('/secondary-accounts')
  @UseGuards(GlobalAuthGuard)
  async secondaryAccounts(
    @Req() req: IRequest
  ): Promise<ISecondaryAccountWithResponse> {
    try {
      const secondaryAccounts = await this.accountService.SecondaryAccountName(
        req.user // must be fetched against req.user.organiztrionId
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

  @Get('ledger/:id')
  @UseGuards(GlobalAuthGuard)
  async AccountLedger(
    @Req() req: IRequest,
    @Query() query: IPage,
    @Param() params: ParamsDto
  ): Promise<IAccountWithResponse> {
    try {
      const account = await this.accountService.AccountLedger(
        req.user,
        query,
        params.id
      );

      if (account) {
        return {
          message: 'Account ledger fetched successfull',
          status: true,
          pagination: account.pagination,
          opening_balance: account.opening_balance,
          result: account.transaction_items,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(
    @Req() req: IRequest,
    @Body() accountDto: AccountDto
  ): Promise<IAccountWithResponse> {
    try {
      const account = await this.accountService.CreateOrUpdateAccount(
        accountDto,
        req.user
      );

      if (account) {
        return {
          message:
            accountDto.isNewRecord !== false
              ? 'Account created successfull'
              : 'Account Updated Successfully',
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

  @Post('init')
  async initAccounts(@Body() data): Promise<void> {
    return await this.accountService.initAccounts(data);
  }

  @Get('/:id')
  @UseGuards(GlobalAuthGuard)
  async show(@Param() params): Promise<IAccountWithResponse> {
    try {
      const account = await this.accountService.FindAccountById(params.id);

      if (account) {
        return {
          message: 'Account fetched successfull',
          result: account,
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

  @UseGuards(GlobalAuthGuard)
  @Put()
  async remove(
    @Body() accountDto: AccountIdsDto
  ): Promise<IAccountWithResponse> {
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

  @Post('codes')
  @UseGuards(GlobalAuthGuard)
  async accountsByCodes(
    @Body() body: AccountCodesDto,
    @Req() req: IRequest
  ): Promise<IAccount[]> {
    return await this.accountService.FindAccountsByCode(body.codes, req.user);
  }

  @Post('sync')
  @UseGuards(GlobalAuthGuard)
  async syncAccounts(@Body() body, @Req() req: IRequest): Promise<void> {
    return await this.accountService.SyncAccounts(body, req.user);
  }
}
