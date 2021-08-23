import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContactDto, ContactIds } from '../dto/contact.dto';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  async index() {
    const contact = await this.contactService.FindAll();

    if (contact) {
      return {
        message: 'Successfull',
        status: true,
        result: contact,
      };
    }
  }

  @Post()
  async create(@Body() contactDto: ContactDto) {
    try {
      const contact = await this.contactService.CreateContact(contactDto);

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
