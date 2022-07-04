export class ItemDto {
  id: number;
  isNewRecord: boolean;
  itemType: number;
  name: string;
  barcode: string;
  code: string;
  keyId: number;
  description: string;
  priceId: number;
  branchId: number;
  stock: number;
}

export class ItemIdsDto {
  id: Array<number>;
}
