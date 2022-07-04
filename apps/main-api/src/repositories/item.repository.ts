import { EntityRepository, Repository } from 'typeorm';
import { Items } from '../entities';

@EntityRepository(Items)
export class ItemRepository extends Repository<Items> {}
