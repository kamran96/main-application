import { EntityRepository, Repository } from 'typeorm';
import { PurchaseOrders } from '../entities/purchaseOrder.entity';

@EntityRepository(PurchaseOrders)
export class PurchaseOrderRepository extends Repository<PurchaseOrders> {}
