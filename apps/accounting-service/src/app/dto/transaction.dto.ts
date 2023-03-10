export class TransactionDto {
  id: number;
  narration: string;
  ref: string;
  amount: number;
  date: Date;
  notes: string;
  entries: Entries;
  status: number;
  isNewRecord: boolean;
}

class Entries {
  debits: Array<Entry>;
  credits: Array<Entry>;
}

class Entry {
  amount: number;
  accountId: number;
  description: string;
}

export class TransactionApiDto {
  transactions: Array<TransactionDataDto>;
}

class TransactionDataDto {
  amount: number;
  cr: Array<EntryData>;
  dr: Array<EntryData>;
  invoice: unknown;
  reference: string;
  createdAt: string;
}

class EntryData {
  amount: number;
  account_id: number;
}

export class ParamsDto {
  id: number;
}

export class DeleteTransactionsDto {
  ids: Array<number>;
}
