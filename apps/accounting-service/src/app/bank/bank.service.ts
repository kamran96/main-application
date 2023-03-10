import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import {
  AccountRepository,
  BankAccountRepository,
  BankRepository,
  SecondaryAccountRepository,
} from '../repositories';
import { Sorting } from '@invyce/sorting';

@Injectable()
export class BankService {
  async ListBanks() {
    return await getCustomRepository(BankRepository).find();
  }

  async ListBankAccount(user, query) {
    const { sort } = query;
    const { sort_column, sort_order } = await Sorting(sort);

    return await getCustomRepository(BankAccountRepository).find({
      where: {
        organizationId: user.organizationId,
        // branchId: user.branchId
      },
      order: {
        [sort_column]: sort_order,
      },
      relations: ['bank', 'account'],
    });
  }

  async CreateBankAccount(data, user) {
    const [secondary_account] = await getCustomRepository(
      SecondaryAccountRepository
    ).find({
      where: { code: '15000', organizationId: user.organizationId },
    });

    const [account] = await getCustomRepository(AccountRepository).find({
      where: {
        organizationId: user.organizationId,
        secondaryAccountId: secondary_account.id,
      },
      order: {
        id: 'DESC',
      },
      take: 1,
    });

    const code = parseInt(account.code);
    const newCode = code + 1;

    const new_account = await getCustomRepository(AccountRepository).save({
      name: data.name,
      code: newCode.toString(),
      secondaryAccountId: secondary_account.id,
      organizationId: user.organizationId,
      // branchId: user.branchId
      createdById: user.id,
      updatedById: user.id,
      status: 1,
    });

    const bank_account = await getCustomRepository(BankAccountRepository).save({
      name: data.name,
      accountNumber: data.accountNumber,
      accountType: data.accountType,
      bankId: data.bankId,
      accountId: new_account.id,
      organizationId: user.organizationId,
      // branchId: user.branchId
      createdById: user.id,
      updatedById: user.id,
      status: 1,
    });

    return { ...bank_account, new_account };
  }
}
