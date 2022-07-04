import { EntityRepository, Repository } from 'typeorm';
import { Contacts } from '../entities';

@EntityRepository(Contacts)
export class ContactRepository extends Repository<Contacts> {}
