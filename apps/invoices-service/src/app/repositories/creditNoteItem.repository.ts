import { EntityRepository, Repository } from 'typeorm';
import { CreditNoteItems } from '../entities/creditNoteItem.entity';

@EntityRepository(CreditNoteItems)
export class CreditNoteItemRepository extends Repository<CreditNoteItems> {}
