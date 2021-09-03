import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class invoiceItems1630588922486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoice_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'invoiceId', type: 'int', isNullable: false },
          { name: 'itemId', type: 'varchar', isNullable: true },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'quantity', type: 'float', isNullable: true },
          { name: 'itemDiscount', type: 'float', isNullable: true },
          { name: 'unitPrice', type: 'float', isNullable: true },
          { name: 'tax', type: 'text', isNullable: true },
          { name: 'total', type: 'float', isNullable: true },
          { name: 'sequence', type: 'int', isNullable: true },
          { name: 'costOfGoodAmount', type: 'float', isNullable: true },
          { name: 'status', type: 'int', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'invoice_items',
      new TableForeignKey({
        columnNames: ['invoiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'invoices',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice_items');
  }
}
