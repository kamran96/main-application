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
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import {
  IRequest,
  IPage,
  IContactWithResponse,
  IContact,
} from '@invyce/interfaces';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
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
  @UseGuards(GlobalAuthGuard)
  async bal(@Req() req: IRequest) {
    return await this.contactService.SyncContactBalances(req);
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(
    @Body() contactDto: ContactDto,
    @Req() req: IRequest
  ): Promise<IContactWithResponse> {
    try {
      const contact = await this.contactService.CreateContact(
        contactDto,
        req.user
      );

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

  @Get('/:id')
  @UseGuards(GlobalAuthGuard)
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
  @UseGuards(GlobalAuthGuard)
  async delete(@Body() deletedIds: ContactIds): Promise<IContactWithResponse> {
    const contact = await this.contactService.Remove(deletedIds);

    if (contact !== undefined) {
      return {
        message: 'Contact deleted succesfully',
        status: true,
      };
    }
  }

  @Post('ids')
  @UseGuards(GlobalAuthGuard)
  async contactByIds(@Body() body: ContactIds): Promise<IContact[]> {
    return await this.contactService.ContactByIds(body);
  }

  @Post('sync')
  @UseGuards(GlobalAuthGuard)
  async syncContacts(@Body() body, @Req() req: IRequest): Promise<void> {
    return await this.contactService.SyncContacts(body, req);
  }
}
