import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { AttributeValue } from '../schemas/attributeValue.schema';
import { Item, ItemSchema } from '../schemas/item.schema';
import { Host, Integrations } from '@invyce/global-constants';
import {
  IBaseUser,
  IGetSingleItemResponse,
  IItem,
  IItemWithResponse,
  IPage,
  IRequest,
} from '@invyce/interfaces';
import { Sorting } from '@invyce/sorting';

import { Price, PriceSchema } from '../schemas/price.schema';
import {
  CodeValidateDto,
  ItemCodesDto,
  ItemDto,
  ItemIdsDto,
} from '../dto/item.dto';
import { ItemLedger } from '../schemas/itemLedger.schema';
import { ItemLedgerDetailDto } from '../dto/ItemLedger.dto';
import e = require('express');
enum IOperationType {
  DECREASE = 'decrease',
  INCREASE = 'increase',
}

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel,
    @InjectModel(AttributeValue.name) private attributeValueModel,
    @InjectModel(Price.name) private priceModel,
    @InjectModel(ItemLedger.name) private itemLedgerModel
  ) {}

  async GetItem(user: IBaseUser, id: string): Promise<IGetSingleItemResponse> {
    const items: IItem[] = await this.itemModel.find({
      status: 1,
      organizationId: user.organizationId,
    });

    console.log(items, 'is here');
    const indexed = items.findIndex((i) => i.id === id);
    const nextItem = items[indexed + 1]?.id || null;
    const prevItem = items[indexed - 1]?.id || null;
    return {
      nextItem,
      prevItem,
    };
  }

  async ListItems(
    itemData: IBaseUser,
    query: IPage
  ): Promise<IItemWithResponse> {
    const { page_size, page_no, query: filters, sort, purpose } = query;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);

    const { sort_column, sort_order } = await Sorting(sort);

    let items;
    if (purpose === 'ALL') {
      items = await this.itemModel
        .find({
          status: 1,
          organizationId: itemData.organizationId,
        })
        .populate('price');
    } else {
      if (filters) {
        const filterData = Buffer.from(filters, 'base64').toString();
        const data = JSON.parse(filterData);

        const myCustomLabels = {
          docs: 'result',
          totalDocs: 'total',
          limit: 'page_size',
          page: 'page_no',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'total_pages',
          meta: 'pagination',
        };

        for (const i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            items = await this.itemModel.paginate(
              {
                status: 1,
                organizationId: itemData.organizationId,
                [i]: { $regex: new RegExp(val, 'i') },
              },
              {
                offset: pn * ps - ps,
                populate: 'price',
                limit: ps,
                sort: { [sort_column]: sort_order },
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'compare') {
            const value =
              typeof data[i]['value'] == 'string'
                ? data[i]['value'].split(',')
                : [data[i]['value']];

            items = await this.itemModel.paginate(
              {
                status: 1,
                organizationId: itemData.organizationId,
                [i]: { $in: value },
              },
              {
                offset: pn * ps - ps,
                populate: 'price',
                limit: ps,
                sort: { [sort_column]: sort_order },
                customLabels: myCustomLabels,
              }
            );
          }
        }
      } else {
        const myCustomLabels = {
          docs: 'result',
          totalDocs: 'total',
          limit: 'page_size',
          page: 'page_no',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'total_pages',
          meta: 'pagination',
        };

        items = await this.itemModel.paginate(
          { status: 1, organizationId: itemData.organizationId },
          {
            offset: pn * ps - ps,
            limit: page_size,
            sort: { [sort_column]: sort_order },
            populate: 'price',
            customLabels: myCustomLabels,
          }
        );
      }
    }

    return items;
  }

  async CreateItem(itemDto: ItemDto, itemData: IBaseUser): Promise<IItem> {
    try {
      let find_item = [];
      if (itemDto.isNewRecord === true) {
        find_item = await this.itemModel.find({
          code: itemDto.code,
          status: 1,
          organizationId: itemData.organizationId,
          branchId: itemData.branchId,
        });
      }

      if (find_item?.length > 0) {
        throw new HttpException(
          'Item with specified code alreay exists',
          HttpStatus.FORBIDDEN
        );
      } else {
        if (itemDto?.isNewRecord === false) {
          const item = await this.FindById(itemDto.id);

          if (item) {
            const updatedItem = {
              name: itemDto.name || item.name,
              description: itemDto.description || item.description,
              code: itemDto.code || item.code,
              barcode: itemDto.barcode || item.barcode,
              categoryId: itemDto.categoryId || item.categoryId,
              itemType: itemDto.itemType || item.itemType,
              isActive: itemDto.isActive || item.isActive,
              hasInventory: itemDto.hasInventory || item.hasInventory,
              hasCategory: itemDto.hasCategory || item.hasCategory,
              stock: itemDto.stock || item.stock,
              organizationId: item.organizationId,
              branchId: item.branchId,
              createdById: item.name,
              updatedById: itemData._id,
            };

            await this.itemModel.updateOne({ _id: itemDto.id }, updatedItem);

            if (itemDto.itemType === 1) {
              await this.attributeValueModel.deleteMany({
                itemId: itemDto.id,
              });

              for (const i of itemDto.attribute_values) {
                const attrib = new this.attributeValueModel(i);
                attrib.itemId = item.id;
                attrib.status = 1;
                await attrib.save();
              }
            }

            return await this.FindById(itemDto.id);
          }
        } else {
          const item = new this.itemModel();
          item.name = itemDto.name;
          item.description = itemDto.description;
          item.code = itemDto.code;
          item.barcode = itemDto.barcode;
          item.categoryId = itemDto.categoryId;
          item.hasInventory = itemDto.hasInventory;
          item.hasCategory = itemDto.hasCategory;
          item.itemType = itemDto.itemType;
          item.isActive = itemDto.isActive;
          item.stock = itemDto.stock;
          item.accountId = itemDto.targetAccount;
          item.openingStock = itemDto.openingStock;
          item.minimumStock = itemDto.minimumStock;
          item.organizationId = itemData.organizationId;
          item.branchId = itemData.branchId;
          item.stock = itemDto?.openingStock
            ? itemDto.openingStock
            : item.stock;
          item.createdById = itemData._id;
          item.updatedById = itemData._id;
          item.status = 1;
          item.totalBillsAmount = 0;
          item.totalInvoicesAmount = 0;
          await item.save();

          if (itemDto.itemType === 1 && itemDto.attribute_values.length > 0) {
            for (const values of itemDto.attribute_values) {
              const attribute_value = new this.attributeValueModel(values);
              attribute_value.itemId = item.id;
              attribute_value.status = 1;
              await attribute_value.save();
            }
          }

          return item;
        }
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // async ItemCode(data) {
  //   const item = await this.itemModel
  //     .findOne({
  //       organizationId: data.organizationId,
  //       branchId: data.branchId,
  //     })
  //     .sort({ createdAt: -1 })
  //     .limit(1);
  // }

  async ManageInventory(data: ItemLedgerDetailDto, user: IBaseUser) {
    for (const i of data.payload) {
      if (i.action === 'create') {
        const details = {
          type: i.type,
          targetId: i.targetId,
          value: i.value,
        };
        const itemLedger = new this.itemLedgerModel({
          itemId: i.itemId,
          details: JSON.stringify(details),
          branchId: user.branchId,
          organizationId: user.organizationId,
          createdById: user.id,
          updatedById: user.id,
          status: 1,
        });
        await itemLedger.save();
      }
    }

    await this.ManageItemStock(data);

    await this.ManageSalesPurchases(data);
  }

  async FindById(itemId: string): Promise<IItem> {
    return await this.itemModel
      .findById(itemId)
      .populate('price')
      .populate('category')
      .populate('attribute_values');
  }

  async findByItemIds(itemIds: ItemIdsDto): Promise<IItem[]> {
    return await this.itemModel.find({
      _id: { $in: itemIds.ids },
    });
  }

  async DeleteItem(data: ItemIdsDto, req: IRequest): Promise<void> {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    for (const i of data.ids) {
      const item = await this.itemModel.findById(i);
      if (item) {
        await this.itemModel.updateOne(
          { _id: i },
          {
            status: 0,
          }
        );
      }

      if (item?.transactionId) {
        await axios.post(
          Host('accounts', 'accounts/transaction/delete'),
          {
            ids: [item.transactionId],
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );
      }
    }
  }

  async FetchMultipleItems(data: ItemCodesDto): Promise<IItem[]> {
    if (data.type === Integrations.XERO) {
      return await this.itemModel.find({
        code: { $in: data.payload },
      });
    } else if (data.type === Integrations.QUICK_BOOK) {
      return await this.itemModel.find({
        importedItemId: { $in: data.payload },
      });
    }
  }

  async ManageItemStock(data): Promise<void> {
    for (const i of data.payload) {
      if (i.action === 'create') {
        const item = await this.itemModel.findById(i.itemId);

        await this.itemModel.updateOne(
          { _id: i.itemId },
          {
            stock:
              i.type === 'decrease'
                ? item.stock - i.value
                : item.stock + i.value,
          }
        );
      } else if (i.action === 'delete') {
        const item = await this.itemModel.findById(i.itemId);

        await this.itemModel.updateOne(
          { _id: i.itemId },
          {
            stock:
              i.type === 'decrease'
                ? item.stock + i.value
                : item.stock - i.value,
          }
        );
      }
    }
  }

  async ManageSalesPurchases(data): Promise<void> {
    const getItem = async (id) => {
      const item = await this.itemModel.findById(id).populate('price');
      return item;
    };

    const getNewValue = (previousPrice, change, action) => {
      if (action === 'create') {
        return previousPrice + change;
      } else if (action === 'delete') {
        return previousPrice - change;
      }
    };

    data?.payload?.forEach(async (i) => {
      if (i.invoiceType === 'bill') {
        const item = await getItem(i.itemId);
        const price = i?.price || item?.price?.purchasePrice;
        const previousAmount = item?.totalBillsAmount || 0;

        const newValue = await getNewValue(
          previousAmount,
          price * i?.value,
          i.action
        );

        await this.itemModel.updateOne(
          { _id: i.itemId },
          {
            totalBillsAmount: newValue,
          }
        );
      } else if (i.invoiceType === 'invoice') {
        const item = await getItem(i.itemId);
        const price = i?.price || item?.price?.salePrice;

        const previousAmount = item?.totalInvoicesAmount || 0;

        await this.itemModel.updateOne(
          { _id: i.itemId },
          {
            totalInvoicesAmount: getNewValue(
              previousAmount,
              price * i?.value,
              i.action
            ),
          }
        );
      }
    });
  }

  async GetItemCode(dto: CodeValidateDto, user: IBaseUser): Promise<any> {
    const { code, id } = dto;
    const item = await this.itemModel.find({
      organizationId: user.organizationId,
      branchId: user.branchId,
      code: code,
      status: 1,
    });

    if (id) {
      if ((!!item.length && item?.[0].id === id) || !item.length) {
        return {
          message: `${code} is available`,
          statusCode: HttpStatus.OK,
          status: true,
        };
      } else if (!!item.length && item[0]._id !== id) {
        return {
          message: `${code} is already in use`,
          statusCode: HttpStatus.BAD_REQUEST,
          status: false,
        };
      }
    } else {
      if (item.length > 0) {
        return {
          message: `${code} is already in use`,
          statusCode: HttpStatus.BAD_REQUEST,
          status: false,
        };
      } else {
        return {
          message: `${code} is available`,
          statusCode: HttpStatus.OK,
          status: true,
        };
      }
    }
  }

  async SyncItems(data, req: IRequest): Promise<any> {
    const { user } = req;
    if (data.type === Integrations.XERO) {
      for (const i of data.items) {
        const items = await this.itemModel.find({
          importedItemId: i.itemID,
          organizationId: user.organizationId,
        });

        if (items.length === 0) {
          const item = new this.itemModel({
            name: i.name,
            description: i.description,
            code: i.code,
            importedItemId: i.itemID,
            importedFrom: Integrations.XERO,
            stock: i.quantityOnHand,
            openingStock: i.quantityOnHand,
            // accountId:
            //   i.isTrackedAsInventory === true
            //     ? await getAccount(i.purchaseDetails.cOGSAccountCode)
            //     : null,
            branchId: user.branchId,
            organizationId: user.organizationId,
            createdById: user.id,
            updatedById: user.id,
            status: 1,
          });
          await item.save();

          const price = new this.priceModel({
            purchasePrice: i.purchaseDetails.unitPrice,
            salePrice: i.salesDetails.unitPrice,
            itemId: item._id,
          });
          await price.save();
        }
      }
    } else if (data.type === Integrations.QUICK_BOOK) {
      for (const i of data.items) {
        const items = await this.itemModel.find({
          importedItemId: i.Id,
          organizationId: user.organizationId,
        });

        if (items.length === 0) {
          const item = new this.itemModel({
            name: i.Name,
            description: i.Description,
            hasInventory: i.TrackQtyOnHand,
            stock: i.TrackQtyOnHand === true ? i.QtyOnHand : null,
            openingStock: i.TrackQtyOnHand === true ? i.QtyOnHand : null,
            importedItemId: i.Id,
            importedFrom: Integrations.QUICK_BOOK,
            organizationId: user.organizationId,
            branchId: user.branchId,
            createdById: user.id,
            updatedById: user.id,
            status: 1,
          });
          await item.save();

          const price = new this.priceModel({
            purchasePrice: i.PurchaseCost,
            salePrice: i.UnitPrice,
            itemId: item._id,
          });
          await price.save();

          // need to work on this...
          // if (i?.TrackQtyOnHand === true) {

          // }
        }
      }
    } else if (data.type === Integrations.CSV_IMPORT) {
      try {
        const { items } = data;
        items.forEach(async (child, index) => {
          const {
            name,
            description,
            openingStock,
            itemType,
            barcode,
            code,
            discount,
            purchasePrice,
            salePrice,
            tax,
            minimumStock,
          } = child;

          const item = new this.itemModel({
            name,
            description,
            hasInventory: true,
            stock: openingStock,
            itemType: itemType === 'product' ? 1 : 2,
            code,
            minimumStock,
            openingStock,
            barcode,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            createdById: req.user.id,
            updatedById: req.user.id,
            status: 1,
            totalBillsAmount: 0,
            totalInvoicesAmount: 0,
          });

          await item.save();

          const token = req?.cookies['access_token'];

          const { data: accounts } = await axios.post(
            Host('accounts', 'accounts/account/codes'),
            {
              codes: ['15004'],
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );

          let amount = 0;
          const accountIndex = data.targetAccounts?.findIndex(
            (i) => (i.index = index)
          );

          let transaction;
          if (openingStock > 0 && accountIndex > -1) {
            amount = openingStock * purchasePrice;

            const debit = {
              amount,
              account_id: await accounts[0].id,
            };
            const credit = {
              amount,
              account_id: data.targetAccounts[accountIndex].value,
            };

            const payload = {
              dr: [debit],
              cr: [credit],
              type: 'item opening stock',
              reference: `${item.name} opening stock`,
              amount,
              status: 1,
            };

            const { data: transactionData } = await axios.post(
              Host('accounts', 'accounts/transaction/api'),
              {
                transactions: payload,
              },
              {
                headers: {
                  cookie: `access_token=${token}`,
                },
              }
            );

            transaction = transactionData;
          }

          const price = new this.priceModel({
            purchasePrice,
            salePrice,
            discount,
            tax,
            itemId: item._id,
            transactionId: transaction ? transaction.id : null,
          });

          price.save();
        });

        return {
          message: 'success',
        };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
  async ImportCSV() {
    const itemKeys: any[] = [];

    const notRequired = [
      'updatedAt',
      'createdAt',
      'updatedById',
      'createdById',
      'status',
      'organizationId',
      'branchId',
      'importedFrom',
      'importedContactId',
      '_id',
      '__v',
      'hasOpeningBalance',
      'transactionId',
      'openingBalance',
      'addresses',
      'hasInventory',
      'stock',
      'isActive',
      'categoryId',
      'hasCategory',
      'hasStock',
      'importedItemId',
      'itemId',
      'priceType',
      'handlingCost',
      'initialPurchasePrice',
      'tradeDiscount',
      'tradePrice',
      'unitsInCorton',
      'priceUnit',
      'accountId',
    ];

    await ItemSchema.eachPath(function (keyName) {
      if (!notRequired.includes(keyName)) {
        const text = keyName;
        const result = text
          .replace(/([A-Z])/g, '$1')
          .replace(/([A-Z][a-z])/g, ' $1')
          .toLocaleLowerCase()
          .split(' ')
          .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
          .join(' ');

        itemKeys.push({
          label: result,
          keyName,
          description: '',
        });
      }
    });
    await PriceSchema.eachPath(function (keyName) {
      if (!notRequired.includes(keyName)) {
        const text = keyName;
        const result = text
          .replace(/([A-Z])/g, '$1')
          .replace(/([A-Z][a-z])/g, ' $1')
          .toLocaleLowerCase()
          .split(' ')
          .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
          .join(' ');

        itemKeys.push({
          label: result,
          keyName,
          description: '',
        });
      }
    });

    return itemKeys;
  }
}
