import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from '../schemas/item.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel) {}

  async CreateItem(itemDto) {
    const item = new this.itemModel(itemDto);
    item.status = 1;
    await item.save();

    return item;
  }
}
