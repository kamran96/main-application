import { EntityRepository, Repository } from 'typeorm';
import { BillItems } from '../entities/billItem.entity';

@EntityRepository(BillItems)
export class BillItemRepository extends Repository<BillItems> {}
