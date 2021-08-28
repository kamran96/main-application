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
}
