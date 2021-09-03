import { EntityRepository, Repository } from 'typeorm';
import { TransactionItems } from '../entities';

@EntityRepository(TransactionItems)
export class TransactionItemRepository extends Repository<TransactionItems> {}
