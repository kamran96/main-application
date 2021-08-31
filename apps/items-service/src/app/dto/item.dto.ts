export class ItemDto {
  id: number;
  name: string;
  description: string;
  code: string;
  barcode: string;
  categoryId: number;
  type: number;
  isActive: boolean;
  stock: number;
  isNewRecord: boolean;
  organizationId: number;
  createdById: number;
  updatedById: number;
  hasInventory: boolean;
  hasCategory: boolean;
  attribute_values: Array<AttributeValuesDto>;
}

export class CategoryDto {
  id: number;
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

export class DeleteCategoryDto {
  ids: Array<string>;
  isLeaf: boolean;
}
