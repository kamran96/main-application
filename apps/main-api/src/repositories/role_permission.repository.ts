import { EntityRepository, Repository } from 'typeorm';
import { RolePermissions } from '../entities';

@EntityRepository(RolePermissions)
export class RolePermissionRepository extends Repository<RolePermissions> {}
