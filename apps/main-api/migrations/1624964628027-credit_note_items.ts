import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class creditNoteItems1624964628027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'credit_note_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'creditNoteId', isNullable: true, type: 'int' },
          { name: 'itemId', isNullable: true, type: 'int' },
          { name: 'quantity', isNullable: true, type: 'float' },
          { name: 'amount', isNullable: true, type: 'varchar' },
          { name: 'organizationId', isNullable: true, type: 'int' },
          { name: 'branchId', isNullable: true, type: 'int' },
          { name: 'status', isNullable: true, type: 'int' },
          { name: 'createdById', isNullable: true, type: 'int' },
          { name: 'updatedById', isNullable: true, type: 'int' },
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
    await queryRunner.createForeignKey(
      'credit_note_items',
      new TableForeignKey({
        columnNames: ['itemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'credit_note_items',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'credit_note_items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'credit_note_items',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'credit_note_items',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('credit_note_items');
  }
}
