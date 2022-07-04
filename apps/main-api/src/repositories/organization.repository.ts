import { EntityRepository, Repository } from 'typeorm';
import { Organizations } from '../entities';

@EntityRepository(Organizations)
export class OrganizationRepository extends Repository<Organizations> {}
