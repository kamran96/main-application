import { EntityRepository, Repository } from 'typeorm';
import { Invoices } from '../entities/invoice.entity';

@EntityRepository(Invoices)
export class InvoiceRepository extends Repository<Invoices> {}
