import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from '../schemas/item.schema';
import { Price } from '../schemas/price.schema';

@Injectable()
export class PriceService {
  constructor(
    @InjectModel(Price.name) private priceModel,
    @InjectModel(Item.name) private itemModel
  ) {}

  async FindById(priceId) {
    return await this.priceModel.findById(priceId);
  }

  async CreatePrice(priceDto) {
    if (priceDto.isNewRecord === false) {
      try {
        for (let i of priceDto.item_ids) {
          const price = await this.FindById(i);
          if (price) {
            // update price
            await this.priceModel.updateOne(
              { _id: i },
              {
                purchasePrice: priceDto.purchasePrice || price.purchasePrice,
                salePrice: priceDto.salePrice || price.salePrice,
                tradePrice: priceDto.tradePrice || price.tradePrice,
                tradeDiscount: priceDto.tradeDiscount || price.tradeDiscount,
                handlingCost: priceDto.handlingCost || price.handlingCost,
                priceUnit: priceDto.priceUnit || price.priceUnit,
                unitsInCorton: priceDto.unitsInCorton || price.unitsInCorton,
                priceType: priceDto.priceType || price.priceType,
                tax: priceDto.tax || price.tax,
                discount: priceDto.discount || price.discount,
              }
            );
          } else {
            // Create Price

            delete priceDto.item_ids;
            const item = await this.itemModel.findById(i);

            const price = new this.priceModel(priceDto);
            price.itemId = i;
            price.initialPurchasePrice =
              item.priceType === 1 ? priceDto.purchasePrice : null;
            await price.save();
          }
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        const itemIds = priceDto.item_ids;
        delete priceDto.item_ids;

        let priceArr = [];
        for (let i of itemIds) {
          const item = await this.FindById(i);
          const price = new this.priceModel(priceDto);

          price.itemId = i;
          price.initialPurchasePrice =
            item?.priceType === 1 ? priceDto.purchasePrice : null;
          await price.save();

          priceArr.push(price);
        }

        return priceArr;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
