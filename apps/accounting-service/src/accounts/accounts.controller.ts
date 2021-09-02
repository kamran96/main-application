import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import {Request} from 'express';
import { AccountsService } from './accounts.service';
// import { JwtAuthGuard } from '../jwt-auth.guard';
import { AccountDto, AccountIdsDto } from '../../dto/account.dto';
import {GlobalAuthGuard} from '@invyce/global-auth-guard'

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountService: AccountsService){}

    @Get()
    @UseGuards(GlobalAuthGuard)
    async index(
      @Req() req: Request,
      @Query() { take, page_no, sort, query, purpose },
    ) {

      console.log(req.user, 'user')
      const account = await this.accountService.ListAccounts(
        req.user,
        take,
        page_no,
        sort,
        query,
        purpose,
      );
      try {
        if (account) {
          return {
            message: 'Account Fetched successfull',
            result: account,
            pagination: account.pagination,
          };
        }
      } catch (error) {
        throw new HttpException(
          `Sorry! Something went wrong, ${error.message}`,
          error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/init-accounts')
    async initAccounts(
      @Req() req: Request,
      @Query() {organizationId,userId}
      ) {
      try {
        // first param is organizationId
        // second param is branchId
        const initialAccounts = await this.accountService.initAccounts(organizationId,userId);
  
        if (initialAccounts) {
          return {
            message: 'Specified Account Crreated & Fetched successfull',
            result: initialAccounts,
          };
        }
      } catch (error) {
        throw new HttpException(
          `Sorry! Something went wrong, ${error.message}`,
          error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/secondary-accounts')
    async secondaryAccounts(
      @Req() req: Request,
      @Query() {organizationId}
      ) {
      try {
        const secondaryAccounts = await this.accountService.SecondaryAccountName(
          // req, // must be fetched against req.user.organiztrionId
          organizationId
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
          error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    // @UseGuards(JwtAuthGuard)
    @Post('/create-update')
    async create(
      @Req() req: Request, 
      @Body() accountDto: AccountDto){
      try {
        const account = await this.accountService.CreateOrUpdateAccount(
          accountDto,
          // req.user,
        );  

        if (account) {
          return {
            message: accountDto.isNewRecord ? 'Account created successfull' : 'Account Updated Successfully',
            result: account,
          };
        }
      } catch (error) {
        throw new HttpException(
          `Sorry! Something went wrong, ${error.message}`,
          error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    // @UseGuards(JwtAuthGuard)
    // @Get(':id')
    // async view(@Param() params, @Req() req) {
    //   try {
    //     const account = await this.accountService.FindAccountById(
    //       params,
    //       req.user,
    //     );
  
    //     if (account) {
    //       return {
    //         message: 'Account fetched successfull',
    //         result: account[0],
    //       };
    //     }
    //     throw new HttpException('Failed to get Account', HttpStatus.BAD_REQUEST);
    //   } catch (error) {
    //     throw new HttpException(
    //       `Sorry! Something went wrong, ${error.message}`,
    //       error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
    //     );
    //   }
    // }
  
    // @UseGuards(JwtAuthGuard)
    // @Put()
    // async remove(@Body() accountDto: AccountIdsDto) {
    //   try {
    //     const account = await this.accountService.DeleteAccount(accountDto);
  
    //     if (account) {
    //       return {
    //         message: 'Resource modified successfully.',
    //         status: 1,
    //       };
    //     }
  
    //     throw new HttpException('Failed to get Accounts', HttpStatus.BAD_REQUEST);
    //   } catch (error) {
    //     throw new HttpException(
    //       `Sorry! Something went wrong, ${error.message}`,
    //       error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
    //     );
    //   }
    // }
}
