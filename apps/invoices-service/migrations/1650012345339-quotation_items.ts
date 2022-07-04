import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class quotationItems1650012345339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quotation_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'quotationId', type: 'int', isNullable: false },
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
      'quotation_items',
      new TableForeignKey({
        columnNames: ['quotationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'quotations',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('quotation_items');
  }
}
