import { EntityRepository, Repository } from 'typeorm';
import { QuotationItems } from '../entities/quotationItem.entity';

@EntityRepository(QuotationItems)
export class QuotationItemRepository extends Repository<QuotationItems> {}
