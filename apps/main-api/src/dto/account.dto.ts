import { IsNotEmpty } from 'class-validator';

export class AccountDto {
  @IsNotEmpty()
  name: string;
  description: string;
  code: string;
  secondaryAccountId: number;
  taxRate: number;
}

export class AccountIdsDto {
  ids: Array<number>;
}
