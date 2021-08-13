import { EntityRepository, Repository } from 'typeorm';
import { Branches } from '../entities';

@EntityRepository(Branches)
export class BranchRepository extends Repository<Branches> {}
