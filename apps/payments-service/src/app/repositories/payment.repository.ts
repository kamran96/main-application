import { EntityRepository, Repository } from 'typeorm';
import { Payments } from '../entities/payment.entity';

@EntityRepository(Payments)
export class PaymentRepository extends Repository<Payments> {}
