import { EntityRepository, Repository } from 'typeorm';
import { UserProfiles } from '../entities';

@EntityRepository(UserProfiles)
export class ProfileRepository extends Repository<UserProfiles> {}
