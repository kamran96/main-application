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
import { Request } from 'express';
import { ContactDto, ContactIdDto, ContactUsDto } from '../dto/contact.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  // for render all contacts
  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Req() req: Request, @Query() { take, page_no, sort, query }) {
    try {
      const contact = await this.contactService.ListContact(
        req.user,
        take,
        page_no,
        sort,
        query
      );
      if (contact) {
        return {
          message: 'Contact fetched successfully.',
          result: contact.item,
          pagination: contact.pagination,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // contact us api for landing page
  @Post('us')
  async createContact(@Body() contactUsDto: ContactUsDto) {
    const contact = await this.contactService.CreateContactUs(contactUsDto);

    if (contact) {
      return {
        message: 'successfull',
        status: 1,
        result: contact,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/pdf')
  async createContactPdf(@Body() contactDto: ContactIdDto) {
    try {
      const contact = await this.contactService.CreateContactPdf(contactDto);

      if (contact as any) {
        return {
          message: 'successfull',
          status: 1,
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

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() contactDto: ContactDto, @Req() req: Request) {
    try {
      const contact = await this.contactService.CreateOrUpdateContact(
        contactDto,
        req.user
      );

      if (contact) {
        return {
          message:
            contactDto.isNewRecord === false
              ? 'Contact updated successfully.'
              : 'Contact created successfully.',
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

  // for view contact against id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async view(@Param() params) {
    try {
      const contact = await this.contactService.FindContactById(params);

      if (contact) {
        return {
          message: 'contact fetched successfully.',
          result: contact[0],
        };
      }

      throw new HttpException('Failed to get Contract', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // for delete contact
  @UseGuards(JwtAuthGuard)
  @Put()
  async remove(@Body() contactDto: ContactIdDto) {
    try {
      const contact = await this.contactService.DeleteContact(contactDto);

      if (contact) {
        return {
          message: 'Resource modified successfully.',
          status: 1,
        };
      }

      throw new HttpException('Failed to get Contacts', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
