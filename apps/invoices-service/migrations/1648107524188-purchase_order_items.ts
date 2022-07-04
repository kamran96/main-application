import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class purchaseOrderItems1648107524188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'purchase_order_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'purchaseOrderId', type: 'int', isNullable: false },
          { name: 'itemId', type: 'varchar', isNullable: true },
          { name: 'accountId', type: 'int', isNullable: true },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'quantity', type: 'float', isNullable: true },
          { name: 'purchasePrice', type: 'float', isNullable: true },
          { name: 'tax', type: 'text', isNullable: true },
          { name: 'total', type: 'float', isNullable: true },
          { name: 'sequence', type: 'int', isNullable: true },
          { name: 'costOfGoodAmount', type: 'float', isNullable: true },
          { name: 'status', type: 'int', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'purchase_order_items',
      new TableForeignKey({
        columnNames: ['purchaseOrderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'purchase_orders',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('purchase_order_items');
  }
}
