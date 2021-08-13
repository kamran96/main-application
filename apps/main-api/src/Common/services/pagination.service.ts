import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class Pagination {
  constructor(private manager: EntityManager) {}

  async paginate(item, take, page_no) {
    const offset =
      take === undefined ? page_no * 20 - 20 || 0 : page_no * take - take;
    const page = take === undefined ? item.length / 20 : item.length / take;
    const total_pages = Math.ceil(page);

    if (page_no == '' || page_no == undefined || page_no == null) {
      page_no = 1;
    }

    // page_no = parseInt(page_no) - 1;

    return {
      total: item.length,
      offset,
      total_pages,
      page_size: parseInt(take) || 20,
      page_total: null,
      page_no: parseInt(page_no),
      sort_column: '',
      sort_order: '',
    };
  }

  async ListApi(itemRepository, take, page_no, sort, sql, itemData = null) {
    try {
      let allItems;
      if (itemData === null) {
        allItems = await itemRepository.find({
          where: { status: 1 },
        });
      } else {
        allItems = await itemRepository.find({
          where: { status: 1, branchId: itemData.branchId },
        });
      }

      const pagination = await this.paginate(allItems, take, page_no);

      const { sort_column, sort_order } = await this.sorting(sort);

      const page = `
    limit ${take || 20}
    offset ${pagination.offset}
  `;
      const item = await this.manager.query(
        (sql += `order by ${sort_column} ${sort_order}
    ${page}`),
      );

      pagination.page_total = item.length;
      pagination.sort_column = sort_column;
      pagination.sort_order = sort_order;

      return {
        item,
        pagination,
      };
    } catch (error) {
      console.log(error);
      throw (error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sorting(sort) {
    let sort_column, sort_order;
    if (sort == '' || sort === undefined || sort === null) {
      sort_column = 'id';
      sort_order = '';
    } else if (sort.startsWith('-')) {
      const [, column] = sort.trim().split('-');
      sort_column = column;
      sort_order = 'DESC';
    } else {
      sort_column = sort;
      sort_order = 'ASC';
    }

    return {
      sort_column,
      sort_order,
    };
  }
}
