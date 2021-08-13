import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class creditNotes1624963249142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'credit_notes',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'contactId', isNullable: true, type: 'int' },
          { name: 'invoiceId', isNullable: true, type: 'int' },
          { name: 'billId', isNullable: true, type: 'int' },
          { name: 'organizationId', isNullable: true, type: 'int' },
          { name: 'branchId', isNullable: true, type: 'int' },
          { name: 'status', isNullable: true, type: 'int' },
          { name: 'createdById', isNullable: true, type: 'int' },
          { name: 'updatedById', isNullable: true, type: 'int' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['contactId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['invoiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'invoices',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['billId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'purchases',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('credit_notes');
  }
}
