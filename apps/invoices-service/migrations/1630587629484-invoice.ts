import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class invoice1630587629484 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'reference', type: 'varchar', isNullable: true },
          { name: 'contactId', type: 'varchar', isNullable: true },
          { name: 'issueDate', type: 'varchar', isNullable: true },
          { name: 'dueDate', type: 'varchar', isNullable: true },
          { name: 'invoiceNumber', type: 'varchar', isNullable: true },
          { name: 'discount', type: 'float', isNullable: true },
          { name: 'grossTotal', type: 'float', isNullable: true },
          { name: 'netTotal', type: 'float', isNullable: true },
          { name: 'date', type: 'varchar', isNullable: true },
          { name: 'invoiceType', type: 'varchar', isNullable: true },
          { name: 'directTax', type: 'float', isNullable: true },
          { name: 'indirectTax', type: 'float', isNullable: true },
          { name: 'isTaxIncluded', type: 'int', isNullable: true },
          { name: 'currency', type: 'varchar', isNullable: true },
          { name: 'comment', type: 'varchar', isNullable: true },
          { name: 'importedFrom', type: 'varchar', isNullable: true },
          { name: 'importedInvoiceId', type: 'varchar', isNullable: true },
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
  }
}
