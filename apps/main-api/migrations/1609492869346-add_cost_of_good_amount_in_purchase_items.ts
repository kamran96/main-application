import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCostOfGoodAmountInPurchaseItems1609492869346
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'costOfGoodAmount',
        isNullable: true,
        type: 'float',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchase_items', 'costOfGoodAmount');
  }
}
