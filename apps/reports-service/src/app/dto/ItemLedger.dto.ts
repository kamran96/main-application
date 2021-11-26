class ItemLedgerDto {
  type: string;
  targetId: number;
  value: number;
  itemId: string;
}

export class ItemLedgerDetailDto {
  payload: Array<ItemLedgerDto>;
}
