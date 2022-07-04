import { EntityRepository, Repository } from 'typeorm';
import { Invoices } from '../entities';

@EntityRepository(Invoices)
export class InvoiceRepository extends Repository<Invoices> {}
