import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCostOfGoodAmountInInvoiceItems1609315334537
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'costOfGoodAmount',
        isNullable: true,
        type: 'float',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoice_items', 'costOfGoodAmount');
  }
}
