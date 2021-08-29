import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AttributeDto, CategoryDto, DeleteCategoryDto } from '../dto/item.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(@Body() categoryDto: CategoryDto) {
    const category = await this.categoryService.CreateCategory(categoryDto);

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
    const attribute = await this.categoryService.FindById(params.id);

    if (attribute) {
      return {
        message: 'Attribute fetched successfull',
        status: true,
        result: attribute[0],
      };
    }
  }

  @Put('/delete')
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
