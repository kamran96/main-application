import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ContactDto, ContactIds, ParamsDto } from '../dto/contact.dto';
import { ContactService } from './contact.service';
import {
  IRequest,
  IPage,
  IContactWithResponse,
  IContact,
} from '@invyce/interfaces';
import { Authenticate } from '@invyce/auth-middleware';

@UseGuards(Authenticate)
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<IContactWithResponse> {
    const contact = await this.contactService.FindAll(req, query);

    if (contact) {
      return {
        message: 'Successfull',
        status: true,
        result: !contact?.pagination ? contact : contact.result,
        pagination: contact.pagination,
      };
    }
  }

  @Get('balance')
  async bal(@Req() req: IRequest) {
    return await this.contactService.SyncContactBalances(req);
  }

  @Get('outstanding-balance')
  async highestOutstandingBalance(@Req() req: IRequest, @Query() query) {
    const contact = await this.contactService.HighestOutstandingBalanceReport(
      req.user,
      query
    );
    if (contact) {
      return {
        message: 'Successfull',
        status: true,
        result: !contact?.pagination ? contact : contact.result,
        pagination: contact.pagination,
      };
    }
  }

  @Get('import-csv')
  async importCsv(): Promise<any> {
    return await this.contactService.ImportCsv();
  }

  @Post()
  async create(
    @Body() contactDto: ContactDto,
    @Req() req: IRequest
  ): Promise<IContactWithResponse> {
    try {
      const contact = await this.contactService.CreateContact(contactDto, req);

      if (contact) {
        return {
          message: 'Successfull',
          status: true,
          result: contact,
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
  async ledger(
    @Param() params: ParamsDto,
    @Req() req: IRequest,
    @Query() page: IPage
  ) {
    try {
      const contact = await this.contactService.Ledger(params.id, req, page);

      if (contact) {
        return {
          message: 'Successfull',
          status: true,
          ...contact,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('/:id')
  async show(@Param() params: ParamsDto): Promise<IContactWithResponse> {
    const contact = await this.contactService.FindById(params.id);

    if (contact) {
      return {
        message: 'Successfull',
        status: true,
        result: contact,
      };
    }
  }

  @Put()
  async delete(
    @Body() deletedIds: ContactIds,
    @Req() req: IRequest
  ): Promise<IContactWithResponse> {
    const contact = await this.contactService.Remove(deletedIds, req);

    if (contact !== undefined) {
      return {
        message: 'Contact deleted succesfully',
        status: true,
      };
    }
  }

  @Post('ids')
  async contactByIds(@Body() body: ContactIds): Promise<IContact[]> {
    return await this.contactService.ContactByIds(body);
  }

  @Post('sync')
  async syncContacts(@Body() body, @Req() req: IRequest): Promise<void> {
    return await this.contactService.SyncContacts(body, req);
  }
}
