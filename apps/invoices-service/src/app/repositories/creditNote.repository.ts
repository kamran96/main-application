import { EntityRepository, Repository } from 'typeorm';
import { CreditNotes } from '../entities/creditNote.entity';

@EntityRepository(CreditNotes)
export class CreditNoteRepository extends Repository<CreditNotes> {}
