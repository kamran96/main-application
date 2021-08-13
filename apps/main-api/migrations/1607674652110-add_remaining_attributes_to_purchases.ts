import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addRemainingAttributesToPurchases1607674652110
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'isTaxIncluded',
        isNullable: true,
        type: 'float',
      }),
    );
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'currency',
        isNullable: true,
        type: 'varchar',
      }),
    );
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'total',
        isNullable: true,
        type: 'float',
      }),
    );
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'unitPrice',
        isNullable: true,
        type: 'float',
      }),
    );
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'itemDiscount',
        isNullable: true,
        type: 'varchar',
      }),
    );
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'tax',
        isNullable: true,
        type: 'text',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'isTaxIncluded');
    await queryRunner.dropColumn('purchases', 'currency');
    await queryRunner.dropColumn('purchase_items', 'total');
    await queryRunner.dropColumn('purchase_items', 'unitPrice');
    await queryRunner.dropColumn('purchase_items', 'itemDiscount');
    await queryRunner.dropColumn('purchase_items', 'tax');
  }
}
