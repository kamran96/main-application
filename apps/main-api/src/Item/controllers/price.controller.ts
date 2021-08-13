import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PriceDto } from '../../dto/price.dto';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { PriceService } from '../services/price.service';

@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() PriceDto: PriceDto, @Req() req: Request) {
    try {
      const price = await this.priceService.createOrUpdatePrice(PriceDto);
      if (price) {
        return {
          message: 'price created successfully',
          result: price,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put()
  async update(@Body() PriceDto: PriceDto, @Param() param) {
    try {
      const price = await this.priceService.createOrUpdatePrice(
        PriceDto,
        param,
      );
      if (price) {
        return {
          message: 'price updated successfully',
          result: price,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async view(@Body() params) {
    try {
      const price = await this.priceService.FindById(params);
      if (price) {
        return {
          message: 'Price Result Founded',
          result: price[0],
        };
      }

      throw new HttpException('Failed to get Price', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
