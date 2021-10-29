import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class creditNote1630669765794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'credit_notes',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'reference', type: 'varchar', isNullable: true },
          { name: 'contactId', type: 'varchar', isNullable: true },
          { name: 'invoiceId', type: 'int', isNullable: true },
          { name: 'billId', type: 'int', isNullable: true },
          { name: 'issueDate', type: 'varchar', isNullable: true },
          { name: 'dueDate', type: 'varchar', isNullable: true },
          { name: 'invoiceNumber', type: 'varchar', isNullable: true },
          { name: 'discount', type: 'float', isNullable: true },
          { name: 'grossTotal', type: 'float', isNullable: true },
          { name: 'netTotal', type: 'float', isNullable: true },
          { name: 'branchId', type: 'varchar', isNullable: true },
          { name: 'organizationId', type: 'varchar', isNullable: true },
          { name: 'createdById', type: 'varchar', isNullable: true },
          { name: 'updatedById', type: 'varchar', isNullable: true },
          { name: 'status', type: 'int', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['invoiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'invoices',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'credit_notes',
      new TableForeignKey({
        columnNames: ['billId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bills',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('credit_notes');
  }
}
