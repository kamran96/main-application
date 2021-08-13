import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addPurchsePriceInPurchaseItems1608809245491
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'purchasePrice',
        isNullable: true,
        type: 'float',
      }),
    );

    await queryRunner.addColumn(
      'role_permissions',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchase_items', 'purchasePrice');
    await queryRunner.dropColumn('role_permissions', 'organizationId');
  }
}
