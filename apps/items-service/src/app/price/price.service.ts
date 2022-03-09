import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { IPrice } from '@invyce/interfaces';
import { Item } from '../schemas/item.schema';
import { Price } from '../schemas/price.schema';
import { PriceDto } from '../dto/price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectModel(Price.name) private priceModel,
    @InjectModel(Item.name) private itemModel
  ) {}

  async FindById(priceId: string): Promise<IPrice> {
    return await this.priceModel.findOne({ itemId: priceId });
  }

  async CreatePrice(priceDto: PriceDto, req): Promise<IPrice | IPrice[]> {
    let token;
    if (process.env.NODE_ENV === 'development') {
      const header = req.headers?.authorization?.split(' ')[1];
      token = header;
    } else {
      if (!req || !req.cookies) return null;
      token = req.cookies['access_token'];
    }

    const tokenType =
      process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    const value =
      process.env.NODE_ENV === 'development'
        ? `Bearer ${token}`
        : `access_token=${token}`;

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [tokenType]: value,
      },
    });

    // fetch inventory account by its code
    const { data: accounts } = await http.post(`accounts/account/codes`, {
      codes: ['15005'],
    });

    const debitArray = [];
    const creditArray = [];
    if (priceDto.isNewRecord === false) {
      try {
        for (const i of priceDto.item_ids) {
          const price = await this.FindById(i);
          const item = await this.itemModel.findById(i);
          if (price) {
            // update price

            await this.priceModel.updateOne(
              { itemId: i },
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

            let worth = 0;
            if (priceDto?.openingStock > 0) {
              worth = priceDto.openingStock * priceDto.purchasePrice;
              const debits = {
                amount: worth,
                account_id: await accounts[0].id,
              };

              const credits = {
                amount: worth,
                account_id: item.accountId,
              };

              debitArray.push(debits);
              creditArray.push(credits);
            }

            const payload = {
              dr: debitArray,
              cr: creditArray,
              type: 'item opening stock balance',
              reference: `${item.name} opening stock balance`,
              amount: worth,
              status: 1,
            };

            let transaction;
            if (worth > 0) {
              const { data } = await http.post('accounts/transaction/api', {
                transactions: payload,
              });
              transaction = data;
            }

            delete priceDto.item_ids;

            const newPrice = new this.priceModel(priceDto);
            newPrice.itemId = i;
            newPrice.initialPurchasePrice =
              item.priceType === 1 ? priceDto.purchasePrice : null;
            newPrice.transactionId = transaction ? transaction.id : null;

            await newPrice.save();

            await this.itemModel.updateOne(
              { _id: i },
              {
                hasStock: true,
              }
            );
          }
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        const itemIds = priceDto.item_ids;
        delete priceDto.item_ids;

        const priceArr = [];

        for (const i of itemIds) {
          const item = await this.itemModel.findById(i);
          const price = await this.FindById(i);

          let worth = 0;
          if (priceDto?.openingStock > 0) {
            worth = priceDto.openingStock * priceDto.purchasePrice;
            const debits = {
              amount: worth,
              account_id: await accounts[0].id,
            };

            const credits = {
              amount: worth,
              account_id: item.accountId,
            };

            debitArray.push(debits);
            creditArray.push(credits);
          }

          const payload = {
            dr: debitArray,
            cr: creditArray,
            type: 'item opening stock balance',
            reference: `${item.name} opening stock balance`,
            amount: worth,
            status: 1,
          };

          let transaction;
          if (worth > 0) {
            const { data } = await http.post('accounts/transaction/api', {
              transactions: payload,
            });
            transaction = data;
          }

          const newPrice = new this.priceModel(priceDto);

          newPrice.itemId = i;
          newPrice.initialPurchasePrice =
            price?.priceType === 1 ? priceDto.purchasePrice : null;
          newPrice.transactionId = transaction ? transaction.id : null;
          await newPrice.save();

          await this.itemModel.updateOne(
            { _id: i },
            {
              hasStock: true,
            }
          );

          priceArr.push(newPrice);
        }

        return priceArr;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
