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

  async ListCategory(user, query) {
    const { page_no, page_size, purpose, parentId } = query;
    let categories;

    if (purpose) {
      categories = await this.categoryModel
        .find({
          status: 1,
          organizationId: user.organizationId,
          isLeaf: true,
        })
        .populate({
          path: 'attributes',
          match: { status: { $gte: 1 } },
        });
    } else {
      const myCustomLabels = {
        docs: 'categories',
        totalDocs: 'total',
        limit: 'pageSize',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'total_pages',
        pagingCounter: 'slNo',
        meta: 'pagination',
      };

      categories = await this.categoryModel.paginate(
        {
          status: 1,
          organizationId: user.organizationId,
          parentId: parentId || null,
        },
        {
          offset: page_no * page_size - page_size,
          limit: page_size,
          populate: {
            path: 'attributes',
            match: { status: { $gte: 1 } },
          },
          customLabels: myCustomLabels,
        }
      );
    }
    return categories;
  }

  async CreateCategory(categoryDto, user) {
    if (categoryDto && categoryDto.isNewRecord === false) {
      const category = await this.FindById(categoryDto.id);

      if (category) {
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
      category.organizationId = user.organizationId;
      category.status = 1;
      await category.save();

      return category;
    }
  }

  async FindById(categoryId) {
    return await this.categoryModel
      .findById(categoryId)
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
        const att = await this.attributeModel.findById(attribute?.id);
        await this.attributeModel.updateOne(
          { _id: attribute.id },
          {
            title: attribute.title || att.title,
            description: attribute.description || att.description,
            valueType: attribute.type || att.valueType,
            values: attribute.values || att.values,
          }
        );
      } else {
        // create attribte
        const type = attribute.type;
        delete attribute.type;
        const attr = new this.attributeModel(attribute);
        attr.categoryId = attribsDto.categoryId;
        attr.valueType = type;
        attr.status = 1;
        await attr.save();
      }
    }

    return true;
  }

  async DeleteCategory(deleteCategoryDto) {
    if (deleteCategoryDto.isLeaf === false) {
      for (let id of deleteCategoryDto.ids) {
        await this.categoryModel.updateOne({ parentId: id }, { status: 0 });
      }
    }

    for (let id of deleteCategoryDto.ids) {
      await this.categoryModel.updateOne({ _id: id }, { status: 0 });
    }

    return true;
  }
}
