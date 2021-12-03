import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreditNoteService } from './credit-note.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { CnParamsDto, CreditNoteDto } from '../dto/credit-note.dto';
import { IRequest, IPage, ICreditNoteWithResponse } from '@invyce/interfaces';

@Controller('credit-note')
export class CreditNoteController {
  constructor(private creditNoteService: CreditNoteService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<ICreditNoteWithResponse> {
    try {
      const invoice = await this.creditNoteService.IndexCreditNote(
        req.user,
        query
      );

      if (invoice) {
        return {
          message: 'Invoice fetched successfully.',
          status: true,
          pagination: invoice.pagination,
          result: invoice.result,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Post()
  async create(
    @Body() creditNoteDto: CreditNoteDto,
    @Req() req: IRequest
  ): Promise<ICreditNoteWithResponse> {
    try {
      const credit_note = await this.creditNoteService.CreateCreditNote(
        creditNoteDto,
        req
      );

      if (credit_note) {
        return {
          message: 'Invoice created successfully.',
          status: true,
          result: credit_note,
        };
      }
      throw new HttpException(
        'Failed to create invoice',
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Get('/:id')
  async show(@Param() params: CnParamsDto): Promise<ICreditNoteWithResponse> {
    try {
      const credit_note = await this.creditNoteService.FindById(params.id);

      if (credit_note) {
        return {
          message: 'credit-note fetched successfully.',
          status: true,
          result: credit_note[0],
        };
      }
      throw new HttpException(
        'Failed to create credit-note',
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
