import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addOrganizationIdInPurchases1606896726367
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'invoiceNumber');
    await queryRunner.dropColumn('purchases', 'type');
    await queryRunner.dropColumn('purchase_items', 'itemDiscount');
    await queryRunner.dropColumn('purchase_items', 'total');

    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'orderNumber',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'invoiceType',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'purchases',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'purchase_items',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'organizationId');
    await queryRunner.dropColumn('purchases', 'orderNumber');
    await queryRunner.dropColumn('purchases', 'invoiceType');
    await queryRunner.dropColumn('purchase_items', 'organizationId');
  }
}
