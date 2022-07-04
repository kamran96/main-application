import { EntityRepository, Repository } from 'typeorm';
import { Permissions } from '../entities';

@EntityRepository(Permissions)
export class PermissionRepository extends Repository<Permissions> {}
