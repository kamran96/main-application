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
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { AttributeDto, CategoryDto, DeleteCategoryDto } from '../dto/item.dto';
import { CategoryService } from './category.service';
import { Request } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Req() req: Request, @Query() query) {
    const category = await this.categoryService.ListCategory(req.user, query);

    if (category) {
      return {
        message: 'Category created successfull',
        status: true,
        result: !category.pagination ? category : category.categories,
        pagination: category.pagination,
      };
    }
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(@Body() categoryDto: CategoryDto, @Req() req: Request) {
    const category = await this.categoryService.CreateCategory(
      categoryDto,
      req.user
    );

    if (category) {
      return {
        message: 'Category created successfull',
        status: true,
        result: category,
      };
    }
  }

  @Post('attribute')
  async createAttribs(@Body() attribsDto: AttributeDto) {
    const attribute = await this.categoryService.CreateAttribute(attribsDto);

    if (attribute) {
      return {
        message: 'Attribute created successfull',
        status: true,
      };
    }
  }

  @Get('/:id')
  async show(@Param() params) {
    try {
      const category = await this.categoryService.FindById(params.id);

      if (category) {
        return {
          message: 'Category fetched successfull',
          status: true,
          result: category,
        };
      }
      throw new HttpException('Catetory not found', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put()
  async delete(@Body() deleteCategoryDto: DeleteCategoryDto) {
    const category = await this.categoryService.DeleteCategory(
      deleteCategoryDto
    );

    if (category) {
      return {
        message: 'Category delete successfully.',
        status: true,
      };
    }
  }
}
