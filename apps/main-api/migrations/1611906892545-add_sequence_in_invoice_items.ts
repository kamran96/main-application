import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addSequenceInInvoiceItems1611906892545
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'sequence',
        type: 'int',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'sequence',
        type: 'int',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoice_items', 'sequence');
    await queryRunner.dropColumn('purchase_items', 'sequence');
  }
}
