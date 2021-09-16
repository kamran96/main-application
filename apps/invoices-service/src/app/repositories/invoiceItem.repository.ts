import { EntityRepository, Repository } from 'typeorm';
import { InvoiceItems } from '../entities/invoiceItem.entity';

@EntityRepository(InvoiceItems)
export class InvoiceItemRepository extends Repository<InvoiceItems> {}
