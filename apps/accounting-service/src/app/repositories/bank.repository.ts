import { EntityRepository, Repository } from 'typeorm';
import { Banks } from '../entities';

@EntityRepository(Banks)
export class BankRepository extends Repository<Banks> {}
