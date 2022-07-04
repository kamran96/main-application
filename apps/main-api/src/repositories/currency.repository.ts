import { EntityRepository, Repository } from 'typeorm';
import { Currencies } from '../entities';

@EntityRepository(Currencies)
export class CurrencyRepository extends Repository<Currencies> {}
