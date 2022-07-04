import { EntityRepository, Repository } from 'typeorm';
import { Integrations } from '../entities';

@EntityRepository(Integrations)
export class IntegrationRepository extends Repository<Integrations> {}
