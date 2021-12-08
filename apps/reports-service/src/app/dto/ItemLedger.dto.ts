class ItemLedgerDto {
  type: string;
  targetId: number;
  value: number;
  itemId: string;
  action: string;
}

export class ItemLedgerDetailDto {
  payload: Array<ItemLedgerDto>;
}
