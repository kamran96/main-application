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

  async CreateItem(itemDto) {
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
          HttpStatus.BAD_REQUEST
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
              updatedById: itemDto.updatedById,
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
          item.organizationId = itemDto.organizationId;
          item.createdById = itemDto.createdById;
          item.updatedById = itemDto.updatedById;
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async FindById(itemId) {
    return await this.itemModel.find({ _id: itemId });
  }
}
