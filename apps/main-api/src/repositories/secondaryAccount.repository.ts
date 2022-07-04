import { EntityRepository, Repository } from 'typeorm';
import { SecondaryAccounts } from '../entities';

@EntityRepository(SecondaryAccounts)
export class SecondaryAccountRepository extends Repository<SecondaryAccounts> {}
