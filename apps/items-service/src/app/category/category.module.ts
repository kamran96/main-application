import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Authenticate } from '@invyce/auth-middleware';
import { Attribute, AttributeSchema } from '../schemas/attribute.schema';
import { Category, CategorySchema } from '../schemas/category.schema';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Attribute.name, schema: AttributeSchema },
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(CategoryController);
  }
}
