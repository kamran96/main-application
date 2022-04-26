import { IBase, IBaseRequest } from './base';

export interface IChildCategory {
  parentId: number;
  isActive: boolean;
  categories: any[];
  isLoading?: boolean;
}

export interface IVariants extends IBase {
  title?: string;
  description?: string;
  categoryId?: number;
  valueType?: string;
  lookupId?: number;
  values?: any[] | any;
  id?: number;
}
export interface ICategory {
  id: number | string;
  title: string;
  parent_id: number | string;
  description: string;
  is_leaf: boolean;
  attachment_id: number;
  categories?: ICategory[];
  isActive?: boolean;
  subCategories?: ICategory[];
  owner?: IVariants[];
}

export interface ICategoriesGetResponse extends IBaseRequest {
  result: ICategory[];
}
