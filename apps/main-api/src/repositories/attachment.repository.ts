import { EntityRepository, Repository } from 'typeorm';
import { Attachments } from '../entities';

@EntityRepository(Attachments)
export class AttachmentRepository extends Repository<Attachments> {}
