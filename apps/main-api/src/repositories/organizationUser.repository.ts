import { EntityRepository, Repository } from 'typeorm';
import { OrganizationUsers } from '../entities';

@EntityRepository(OrganizationUsers)
export class OrganizationUserRepository extends Repository<OrganizationUsers> {}
