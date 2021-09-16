import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AttributeValue } from '../schemas/attributeValue.schema';
import { Item } from '../schemas/item.schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel,
    @InjectModel(AttributeValue.name) private attributeValueModel
  ) {}

  async ListItems(itemData, query) {
    const { page_size, page_no, filters, purpose } = query;

    let items;
    if (purpose === 'ALL') {
      items = await this.itemModel.find({
        status: 1,
        organizationId: itemData.organizationId,
      });
    } else {
      if (filters) {
        const filterData: any = Buffer.from(filters, 'base64').toString();
        const data = JSON.parse(filterData);

        for (let i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            items = await this.itemModel.find({
              status: 1,
              organizationId: itemData.organizationId,
              [i]: { $regex: val },
            });
          } else if (data[i].type === 'date-between') {
            const start_date = i[1]['value'][0];
            const end_date = i[1]['value'][1];
            items = await this.itemModel.find({
              status: 1,
              organizationId: itemData.organizationId,
              [i]: { $gt: start_date, $lt: end_date },
            });
          } else if (data[i].type === 'compare') {
            items = await this.itemModel.find({
              status: 1,
              organization: itemData.organizationId,
              [i]: { $in: i[1]['value'] },
            });
          } else if (data[i].type === 'in') {
            items = await this.itemModel.find({
              status: 1,
              organization: itemData.organizationId,
              [i]: { $in: i[1]['value'] },
            });
          }
        }
      } else {
        const myCustomLabels = {
          docs: 'items',
          limit: 'pageSize',
          page: 'currentPage',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'totalPages',
          pagingCounter: 'slNo',
          meta: 'pagination',
        };

        items = await this.itemModel.paginate(
          { status: 1, organizationId: itemData.organizationId },
          {
            offset: page_no * page_size - page_size,
            limit: page_size,
            customLabels: myCustomLabels,
          }
        );
      }
    }
    return items;
  }

  async CreateItem(itemDto, itemData) {
    try {
      let find_item = [];
      if (itemDto.isNewRecord === true) {
        find_item = await this.itemModel.find({
          code: itemDto.code,
          status: 1,
          organizationId: itemDto.organizationId,
        });
      }

      if (find_item?.length > 0) {
        throw new HttpException(
          'Item with specified code alreay exists',
          HttpStatus.FORBIDDEN
        );
      } else {
        if (itemDto?.isNewRecord === false) {
          const result = await this.FindById(itemDto.id);

          if (Array.isArray(result) && result.length > 0) {
            const [item] = result;
            let updatedItem = {
              name: itemDto.name || item.name,
              description: itemDto.description || item.description,
              code: itemDto.code || item.code,
              barcode: itemDto.barcode || item.barcode,
              categoryId: itemDto.categoryId || item.categoryId,
              type: itemDto.type || item.type,
              isActive: itemDto.isActive || item.isActive,
              stock: itemDto.stock || item.stock,
              organizationId: item.organizationId,
              createdById: item.name,
              updatedById: itemData._id,
            };

            await this.itemModel.updateOne({ _id: itemDto.id }, updatedItem);

            if (itemDto.type === 1) {
              await this.attributeValueModel.findOneAndDelete({
                itemId: itemDto.id,
              });

              for (let i of itemDto.attribute_values) {
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
          item.type = itemDto.type;
          item.isActive = itemDto.isActive;
          item.stock = itemDto.stock;
          item.organizationId = itemData.organizationId;
          item.createdById = itemData._id;
          item.updatedById = itemData._id;
          item.status = 1;
          await item.save();

          if (itemDto.attribute_values.length > 0) {
            for (let values of itemDto.attribute_values) {
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

  async FindById(itemId) {
    return await this.itemModel.find({ _id: itemId });
  }

  async;
}
