export class ItemDto {
  id: string;
  name: string;
  description: string;
  code: string;
  barcode: string;
  categoryId: number;
  itemType: number;
  isActive: boolean;
  stock: number;
  openingStock: number;
  minimumStock: number;
  isNewRecord: boolean;
  hasInventory: boolean;
  hasCategory: boolean;
  targetAccount: number;
  attribute_values: Array<AttributeValuesDto>;
}

export class CategoryDto {
  id: string;
  title: string;
  description: string;
  parentId: number;
  isLeaf: boolean;
  isNewRecord: boolean;
  organizationId: number;
  createdById: number;
  updatedById: number;
}

export class AttributeDto {
  categoryId: number;
  attributes: Array<Attributes>;
  deleted_ids: Array<string>;
}

export class Attributes {
  id: number;
  title: string;
  description: string;
  valueType: string;
  values: Array<string>;
}

class AttributeValuesDto {
  value: string;
  attributeId: string;
}

export class ItemIdsDto {
  ids: Array<string>;
}

export class DeleteCategoryDto {
  ids: Array<string>;
  isLeaf: boolean;
}

export class ItemCodesDto {
  type: string;
  payload: Array<string>;
}

export class ParamsDto {
  id: string;
}

export class CodeValidateDto {
  code: string;
}
