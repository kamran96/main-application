import { EntityRepository, Repository } from 'typeorm';
import { BankAccounts } from '../entities';

@EntityRepository(BankAccounts)
export class BankAccountRepository extends Repository<BankAccounts> {}
