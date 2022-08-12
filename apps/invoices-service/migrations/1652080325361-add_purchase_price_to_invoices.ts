import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addPurchasePriceToInvoices1652080325361
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'purchasePrice',
        isNullable: true,
        type: 'varchar',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'purchasePrice');
  }
}
