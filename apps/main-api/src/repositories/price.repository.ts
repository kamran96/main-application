import { EntityRepository, Repository } from 'typeorm';
import { Prices } from '../entities';

@EntityRepository(Prices)
export class PriceRepository extends Repository<Prices> { }
