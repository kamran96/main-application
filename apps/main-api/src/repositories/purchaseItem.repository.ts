import { EntityRepository, Repository } from 'typeorm';
import { PurchaseItems } from '../entities';

@EntityRepository(PurchaseItems)
export class PurchaseItemRepository extends Repository<PurchaseItems> {}
