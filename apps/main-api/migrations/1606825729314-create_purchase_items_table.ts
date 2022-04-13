import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createPurchaseItemsTable1606825729314
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'purchase_items',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'purchaseId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'itemId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'itemDiscount',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'total',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'createdBy',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true
    );
    await queryRunner.createForeignKey(
      'purchase_items',
      new TableForeignKey({
        columnNames: ['purchaseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'purchases',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'purchase_items',
      new TableForeignKey({
        columnNames: ['itemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('purchase_items');
  }
}
