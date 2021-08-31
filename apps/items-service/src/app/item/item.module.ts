import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AttributeValue,
  AttributeValueSchema,
} from '../schemas/attributeValue.schema';
import { Item, ItemSchema } from '../schemas/item.schema';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: AttributeValue.name, schema: AttributeValueSchema },
    ]),
  ],
  providers: [ItemService, Authenticate],
  controllers: [ItemController],
})
export class ItemModule {}
