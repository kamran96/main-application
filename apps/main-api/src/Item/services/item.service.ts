import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, getCustomRepository } from 'typeorm';
import { Items } from '../../entities';
import { ItemRepository } from '../../repositories';
import { Pagination } from '../../Common/services/pagination.service';

@Injectable()
export class ItemService {
  constructor(private manager: EntityManager, private pagination: Pagination) {}

  async ListItem(itemData, take, page_no, sort, query) {
    try {
      const itemRepository = getCustomRepository(ItemRepository);
      const sql = `
      select i.id, i.name, i.barcode, i.code, i."keyId", i.description, i."priceId",
      i."status", i."branchId", i."createdAt", i."updatedAt", i."createdById", i."updatedById",
      i."productType", i."itemType"
      from items i
      where i."branchId" = ${itemData.branchId}
      and i.status = 1
      `;

      return await this.pagination.ListApi(
        itemRepository,
        take,
        page_no,
        sort,
        sql,
        itemData,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createOrUpdateItem(itemDto, itemData) {
    const itemRepository = getCustomRepository(ItemRepository);
    if (itemDto && itemDto.isNewRecord === false) {
      // we need to update item.
      try {
        const result = await this.FindItemById(itemDto);

        if (Array.isArray(result) && result.length > 0) {
          const [item] = result;
          const updatedItem = { ...item };
          delete updatedItem.id;

          updatedItem.name = itemDto.name || item.name;
          updatedItem.itemType = itemDto.itemType || item.itemType;
          updatedItem.barcode = itemDto.barcode || item.barcode;
          updatedItem.code = itemDto.code || item.code;
          updatedItem.description = itemDto.description || item.description;
          updatedItem.keyId = itemDto.keyId || item.keyId;
          updatedItem.priceId = itemDto.priceId || item.priceId;
          updatedItem.branchId = item.branchId;
          updatedItem.organizationId = item.organizationId;
          updatedItem.status = item.status;
          updatedItem.createdById = item.createdById;
          updatedItem.updatedById = itemData.userId || item.updatedById;

          await this.manager.update(Items, { id: itemDto.id }, updatedItem);

          const newItem = await this.FindItemById(itemDto);
          return newItem;
        }
        throw new HttpException('Invalid Params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      // we need to create
      try {
        const item = await itemRepository.save({
          name: itemDto.name,
          itemType: itemDto.itemType,
          barcode: itemDto.barcode,
          code: itemDto.code,
          keyId: null,
          description: itemDto.description,
          stock: itemDto.stock,
          priceId: null,
          branchId: itemData.branchId,
          organizationId: itemData.organizationId,
          createdById: itemData.userId,
          updatedById: itemData.userId,

          status: 1,
        });

        return item;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async FindItemById(params) {
    try {
      const itemRepository = getCustomRepository(ItemRepository);
      const item = await itemRepository.find({
        where: { id: params.id, status: 1 },
      });

      return item;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async DeleteItem(itemIdDto) {
    try {
      for (let i of itemIdDto.ids) {
        await this.manager.update(Items, { id: i }, { status: 0 });
      }

      const itemRepository = getCustomRepository(ItemRepository);
      const [item] = await itemRepository.find({
        where: {
          id: itemIdDto.ids[0],
        },
      });
      return item;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
