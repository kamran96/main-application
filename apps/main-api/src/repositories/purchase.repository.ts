import { EntityRepository, Repository } from 'typeorm';
import { Purchases } from '../entities';

@EntityRepository(Purchases)
export class PurchaseRepository extends Repository<Purchases> {}
