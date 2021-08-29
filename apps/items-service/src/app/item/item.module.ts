import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AttributeValue,
  AttributeValueSchema,
} from '../schemas/attributeValue.schema';
import { Item, ItemSchema } from '../schemas/item.schema';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: AttributeValue.name, schema: AttributeValueSchema },
    ]),
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
