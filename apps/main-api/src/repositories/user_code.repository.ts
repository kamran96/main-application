import { EntityRepository, Repository } from 'typeorm';
import { UserCodes } from '../entities';

@EntityRepository(UserCodes)
export class UserCodeRepository extends Repository<UserCodes> {}
