import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { IPriceWithResponse } from '@invyce/interfaces';
import { ParamsDto } from '../dto/item.dto';
import { PriceDto } from '../dto/price.dto';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Get('/:id')
  async show(@Param() params: ParamsDto): Promise<IPriceWithResponse> {
    try {
      const price = await this.priceService.FindById(params.id);

      if (price) {
        return {
          message: 'Price fetched successfully.',
          status: true,
          result: price,
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
  async create(
    @Body() priceDto: PriceDto,
    @Req() req: Request
  ): Promise<IPriceWithResponse> {
    try {
      const price = await this.priceService.CreatePrice(priceDto, req);

      if (price) {
        return {
          message: 'Price created successfully.',
          status: true,
          result: price,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
