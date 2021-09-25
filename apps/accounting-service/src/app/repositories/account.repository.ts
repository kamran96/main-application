import { EntityRepository, Repository } from 'typeorm';
import { Accounts } from '../entities';

@EntityRepository(Accounts)
export class AccountRepository extends Repository<Accounts> {}
