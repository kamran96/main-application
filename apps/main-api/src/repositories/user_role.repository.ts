import { EntityRepository, Repository } from 'typeorm';
import { UserRoles } from '../entities';

@EntityRepository(UserRoles)
export class UserRoleRepository extends Repository<UserRoles> {}
