import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, getCustomRepository } from 'typeorm';
import { Prices } from '../../entities';
import { PriceRepository } from '../../repositories';
@Injectable()
export class PriceService {
  constructor(private manager: EntityManager) {}
  async createOrUpdatePrice(priceDto, params = null) {
    const PriceRepo = getCustomRepository(PriceRepository);
    // if request is for update
    if (params && params.id && params.id != undefined) {
      try {
        const result = await this.FindById(params);

        if (Array.isArray(result) && result.length > 0) {
          const [price] = result;

          const updatePrice = { ...price };

          updatePrice.priceType = priceDto.priceType || price.priceType;
          updatePrice.purchasePrice =
            priceDto.purchasePrice || price.purchasePrice;
          updatePrice.salePrice = priceDto.salePrice || price.salePrice;
          updatePrice.tradePrice = priceDto.tradePrice || price.tradePrice;
          updatePrice.tradeDiscount =
            priceDto.tradeDiscount || price.tradeDiscount;
          updatePrice.handlingCost =
            priceDto.handlingCost || price.handlingCost;
          updatePrice.priceUnit = priceDto.priceUnit || price.priceUnit;
          updatePrice.unitsInCarton =
            priceDto.unitsInCarton || price.unitsInCarton;

          await this.manager.update(Prices, { id: params.id }, updatePrice);
          return updatePrice;
        }
        throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        const price = await PriceRepo.save({
          priceType: priceDto.priceType,
          purchasePrice: priceDto.purchasePrice,
          salePrice: priceDto.salePrice,
          tradePrice: priceDto.tradePrice,
          tradeDiscount: priceDto.tradeDiscount,
          handlingCost: priceDto.handlingCost,
          priceUnit: priceDto.priceUnit,
          unitsInCarton: priceDto.unitsInCarton,
        });
        return price;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async FindById(params) {
    try {
      const PriceRepo = getCustomRepository(PriceRepository);
      const price = await PriceRepo.find({
        where: { id: params.id },
      });

      return price;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
