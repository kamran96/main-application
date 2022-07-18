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
} from '@nestjs/common';
import {
  AttributeDto,
  CategoryDto,
  DeleteCategoryDto,
  ParamsDto,
} from '../dto/item.dto';
import { CategoryService } from './category.service';
import {
  IRequest,
  IPage,
  ICategoryWithResponse,
  IAttributeWithResponse,
} from '@invyce/interfaces';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<ICategoryWithResponse> {
    const category = await this.categoryService.ListCategory(req.user, query);

    if (category) {
      return {
        message: 'Category created successfull',
        status: true,
        result: !category.pagination ? category : category.result,
        pagination: category.pagination,
      };
    }
  }

  @Post()
  async create(
    @Body() categoryDto: CategoryDto,
    @Req() req: IRequest
  ): Promise<ICategoryWithResponse> {
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
  async createAttribs(
    @Body() attribsDto: AttributeDto
  ): Promise<IAttributeWithResponse> {
    const attribute = await this.categoryService.CreateAttribute(attribsDto);

    if (attribute) {
      return {
        message: 'Attribute created successfull',
        status: true,
      };
    }
  }

  @Get('/:id')
  async show(@Param() params: ParamsDto): Promise<ICategoryWithResponse> {
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
  async delete(
    @Body() deleteCategoryDto: DeleteCategoryDto
  ): Promise<ICategoryWithResponse> {
    const category = await this.categoryService.DeleteCategory(
      deleteCategoryDto
    );

    if (category !== undefined) {
      return {
        message: 'Category delete successfully.',
        status: true,
      };
    }
  }
}
