import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from '../schemas/item.schema';
import { Price, PriceSchema } from '../schemas/price.schema';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Price.name, schema: PriceSchema },
      { name: Item.name, schema: ItemSchema },
    ]),
  ],
  providers: [PriceService],
  controllers: [PriceController],
})
export class PriceModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(PriceController);
  }
}
