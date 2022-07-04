import { EntityRepository, Repository } from 'typeorm';
import { PrimaryAccounts } from '../entities';

@EntityRepository(PrimaryAccounts)
export class PrimaryAccountRepository extends Repository<PrimaryAccounts> {}
