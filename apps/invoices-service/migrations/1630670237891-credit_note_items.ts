import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class creditNoteItems1630670237891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'credit_note_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'creditNoteId', type: 'int', isNullable: false },
          { name: 'itemId', type: 'varchar', isNullable: true },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'quantity', type: 'float', isNullable: true },
          { name: 'itemDiscount', type: 'float', isNullable: true },
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
      'credit_note_items',
      new TableForeignKey({
        columnNames: ['creditNoteId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'credit_notes',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('credit_note_items');
  }
}
