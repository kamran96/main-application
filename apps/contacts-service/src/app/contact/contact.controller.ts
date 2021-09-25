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
import { Request } from 'express';
import { ContactDto, ContactIds } from '../dto/contact.dto';
import { ContactService } from './contact.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Req() req: Request, @Query() query) {
    const contact = await this.contactService.FindAll(req.user, query);

    if (contact) {
      return {
        message: 'Successfull',
        status: true,
        result: !contact?.pagination ? contact : contact.contacts,
        pagination: contact.pagination,
      };
    }
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(@Body() contactDto: ContactDto, @Req() req: Request) {
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
  async show(@Param() params) {
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
  async delete(@Body() deletedIds: ContactIds) {
    const contact = await this.contactService.Remove(deletedIds);

    if (contact) {
      return {
        message: 'Contact deleted succesfully',
        status: true,
      };
    }
  }
}
