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
import { ItemLedger, ItemLedgerSchema } from '../schemas/itemLedger.schema';

@Module({
  controllers: [ItemController],
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: AttributeValue.name, schema: AttributeValueSchema },
      { name: Price.name, schema: PriceSchema },
      { name: ItemLedger.name, schema: ItemLedgerSchema },
    ]),
  ],
  providers: [ItemService],
})
export class ItemModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(ItemController);
  }
}
