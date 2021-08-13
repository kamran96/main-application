import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addPurchaseAndSalePriceToDispatchItems1611662766092
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'dispatch_items',
      new TableColumn({
        name: 'purchasePrice',
        type: 'float',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'dispatch_items',
      new TableColumn({
        name: 'salePrice',
        type: 'float',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('dispatch_items', 'purchasePrice');
    await queryRunner.dropColumn('dispatch_items', 'salePrice');
  }
}
