import { EntityRepository, Repository } from 'typeorm';
import { Transactions } from '../entities';

@EntityRepository(Transactions)
export class TransactionRepository extends Repository<Transactions> {}
