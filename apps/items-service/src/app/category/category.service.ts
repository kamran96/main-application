import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attribute } from '../schemas/attribute.schema';
import { Category } from '../schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel,
    @InjectModel(Attribute.name) private attributeModel
  ) {}

  async CreateCategory(categoryDto) {
    if (categoryDto && categoryDto.isNewRecord === false) {
      const resp = await this.FindById(categoryDto.id);

      if (Array.isArray(resp) && resp.length > 0) {
        const [category] = resp;

        let updatedCategory = {
          title: categoryDto.title || category.title,
          description: categoryDto.description || category.description,
        };

        await this.categoryModel.updateOne(
          { _id: categoryDto.id },
          updatedCategory
        );
        return await this.FindById(categoryDto.id);
      }
    } else {
      const category = new this.categoryModel(categoryDto);
      category.status = 1;
      await category.save();

      return category;
    }
  }

  async FindById(categoryId) {
    return await this.categoryModel
      .find({ _id: categoryId })
      .populate('attributes', null, { status: 1 });
  }

  async CreateAttribute(attribsDto) {
    if (attribsDto.deleted_ids?.length > 0) {
      for (let id of attribsDto.deleted_ids) {
        await this.attributeModel.updateOne({ _id: id }, { status: 0 });
      }
    }

    delete attribsDto.deleted_ids;
    for (let attribute of attribsDto.attributes) {
      if (attribute?.id) {
        // update attribute
        const att = this.attributeModel.findById(attribute.id);
        await this.attributeModel.updateOne(
          { _id: attribute.id },
          {
            title: attribsDto.title || att.title,
            description: attribsDto.description || att.description,
            type: attribsDto.type || att.type,
            value: attribsDto.value || att.value,
          }
        );
      } else {
        // create attribte
        const attr = new this.attributeModel(attribute);
        attr.categoryId = attribsDto.categoryId;
        attr.status = 1;
        await attr.save();
      }
    }

    return true;
  }

  async DeleteCategory(deleteCategoryDto) {
    if (deleteCategoryDto.isLeaf === false) {
      for (let id of deleteCategoryDto.ids) {
        const category = this.categoryModel.findOne({ _id: id });
        await this.categoryModel.updateOne(
          { parentId: category._id },
          { status: 0 }
        );
      }
    }

    for (let id of deleteCategoryDto.ids) {
      await this.categoryModel.updateOne({ _id: id }, { status: 0 });
    }

    return true;
  }
}
