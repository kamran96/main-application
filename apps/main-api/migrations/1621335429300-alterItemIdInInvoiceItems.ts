import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterItemIdInInvoiceItems1621335429300
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table invoice_items alter column "itemId" drop not null`
    );
    await queryRunner.query(
      `alter table purchase_items alter column "itemId" drop not null`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
