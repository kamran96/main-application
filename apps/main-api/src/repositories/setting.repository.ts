import { EntityRepository, Repository } from 'typeorm';
import { KeyStorages } from '../entities';

@EntityRepository(KeyStorages)
export class SettingRepository extends Repository<KeyStorages> {}
