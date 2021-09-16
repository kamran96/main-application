import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PriceDto } from '../dto/price.dto';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Get('/:id')
  async show(@Param() params) {
    try {
      const price = await this.priceService.FindById(params.id);

      if (price) {
        return {
          message: 'Price fetched successfully.',
          status: true,
          result: price[0] || [],
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
  async create(@Body() priceDto: PriceDto) {
    try {
      const price = await this.priceService.CreatePrice(priceDto);

      if (price) {
        return {
          message: 'Price created successfully.',
          status: true,
          result: price,
        };
      }

      throw new HttpException('Failed to create Price', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
