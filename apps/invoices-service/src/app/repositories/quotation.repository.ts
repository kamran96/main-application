import { EntityRepository, Repository } from 'typeorm';
import { Quotations } from '../entities/quotation.entity';

@EntityRepository(Quotations)
export class QuotationRepository extends Repository<Quotations> {}
