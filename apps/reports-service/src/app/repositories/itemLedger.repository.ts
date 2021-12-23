import { EntityRepository, Repository } from 'typeorm';
import { ItemLedgers } from '../entities/itemLedger.entity';

@EntityRepository(ItemLedgers)
export class ItemLedgerRepository extends Repository<ItemLedgers> {}
