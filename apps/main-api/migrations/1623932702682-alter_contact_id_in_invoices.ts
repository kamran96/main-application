import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterContactIdInInvoices1623932702682
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table invoices alter column "contactId" drop not null`
    );
    await queryRunner.query(
      `alter table purchases alter column "contactId" drop not null`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
