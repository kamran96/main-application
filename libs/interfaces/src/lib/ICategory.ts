import { IBase, IPagination } from '..';

export interface ICategory extends IBase {
  title: string;
  description: string;
  parentId: number;
  isLeaf: boolean;
}

export interface ICategoryWithResponse {
  message: string;
  status: boolean;
  result?: ICategory[] | ICategory | ICategoryWithResponse;
  pagination?: IPagination;
}

export interface IAttributeWithResponse {
  message: string;
  status: boolean;
}
