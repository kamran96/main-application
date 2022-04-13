import { EntityRepository, Repository } from 'typeorm';
import { PurchaseOrderItems } from '../entities/purchaseOrderItem.entity';

@EntityRepository(PurchaseOrderItems)
export class PurchaseOrderItemRepository extends Repository<PurchaseOrderItems> {}
