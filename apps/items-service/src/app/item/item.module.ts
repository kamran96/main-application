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
import { Price, PriceSchema } from '../schemas/price.schema';

@Module({
  controllers: [ItemController],
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: AttributeValue.name, schema: AttributeValueSchema },
      { name: Price.name, schema: PriceSchema },
    ]),
  ],
  providers: [ItemService, Authenticate],
})
export class ItemModule {}
