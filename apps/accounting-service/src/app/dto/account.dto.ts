import { IsNotEmpty } from 'class-validator';

export class AccountDto {
  @IsNotEmpty()
  name: string;
  description: string;
  code: number | string;
  secondaryAccountId: number;
  primaryAccountId: number;
  importedFrom: string;
  taxRate: number;
  id: number;
  isNewRecord: boolean;
}

export class AccountIdsDto {
  ids: Array<number>;
}

export class AccountCodesDto {
  codes: Array<string>;
}
