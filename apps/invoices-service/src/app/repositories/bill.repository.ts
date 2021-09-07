import { EntityRepository, Repository } from 'typeorm';
import { Bills } from '../entities/bill.entity';

@EntityRepository(Bills)
export class BillRepository extends Repository<Bills> {}
