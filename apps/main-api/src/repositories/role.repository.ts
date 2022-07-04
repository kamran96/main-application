import { EntityRepository, Repository } from 'typeorm';
import { Roles } from '../entities';

@EntityRepository(Roles)
export class RoleRepository extends Repository<Roles> {}
