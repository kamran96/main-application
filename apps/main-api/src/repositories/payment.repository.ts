import { EntityRepository, Repository } from 'typeorm';
import { Payments } from '../entities';

@EntityRepository(Payments)
export class PaymentRepository extends Repository<Payments> {}
