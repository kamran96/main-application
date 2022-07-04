import { EntityRepository, Repository } from 'typeorm';
import { InvoiceItems } from '../entities';

@EntityRepository(InvoiceItems)
export class InvoiceItemRepository extends Repository<InvoiceItems> {}
