import { IBase, IPagination } from '..';
import { message } from 'antd';

export interface IItem extends IBase {
  name: string;
  description: string;
  code: string;
  barcode: string;
  categoryId: number;
  itemType: number;
  isActive: boolean;
  stock: number;
  hasInventory: boolean;
  hasCategory: boolean;
}

export interface IAttributeValues {
  value: string;
  attributeId: string;
}

export interface IAttributes {
  id: number;
  title: string;
  description: string;
  valueType: string;
  values: Array<string>;
}

export interface IItemWithResponse {
  message: string;
  status: boolean;
  result?: IItem[] | IItem | IItemWithResponse;
  pagination?: IPagination;
}

export interface IGetSingleItemResponse {
  nextItem: string | number;
  prevItem: string | number;
}
