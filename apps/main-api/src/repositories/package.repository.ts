import { EntityRepository, Repository } from 'typeorm';
import { Packages } from '../entities';

@EntityRepository(Packages)
export class PackageRepository extends Repository<Packages> {}
