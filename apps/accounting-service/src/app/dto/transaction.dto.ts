export class TransactionDto {
  narration: string;
  ref: string;
  amount: number;
  date: Date;
}

export class TransactionApiDto {
  amount: number;
  cr: Array<any>;
  dr: Array<any>;
  invoice: any;
  reference: string;
  createdAt: string;
}
