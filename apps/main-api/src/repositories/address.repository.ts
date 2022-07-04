import { EntityRepository, Repository } from 'typeorm';
import { Addresses } from '../entities';

@EntityRepository(Addresses)
export class AddressRepository extends Repository<Addresses> {}
